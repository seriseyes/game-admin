import AdminDAO from "../../dao/AdminDAO";
import React, {useEffect, useState} from "react";
import {State} from "../../models/Response";
import {toast} from "react-toastify";
import Col from "../../components/layouts/Col";
import css from "./User.module.css";
import Row from "../../components/layouts/Row";
import {LoadingButton} from "@mui/lab";
import Window from "../../components/window/Window";
import {Autocomplete, TextField} from "@mui/material";

export interface User {
    id: number;
    username: string;
    balance: number;
    account: string;
    bankType: string;
    bankAccountName: string;
}

export default function Users() {
    const dao = new AdminDAO();
    const [state, setState] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setFiltered(state.filter(f => f.username.toLowerCase().includes(name.toLowerCase())));
    }, [name]);

    const fetchData = async () => {
        const response = await dao.findAllUsers()
        if (response.state === State.SUCCESS) {
            setState(response.data);
            setFiltered(response.data);
        } else toast.error(response.message);
    }

    return <Col gap={15}>
        <TextField
            sx={{width: "200px"}}
            label={"Нэрээр хайх"}
            value={name}
            onChange={(e: any) => setName(e.target.value)}
        />
        <Row gap={6} style={{flexWrap: "wrap"}}>
            {filtered.map((el, i) => <SingleUser name={el.username} onSave={fetchData} key={i} user={el}/>)}
        </Row>
    </Col>
}

function SingleUser(props: { name: string, user: User, onSave: () => void }) {
    const [open, setOpen] = useState(false);

    return <Col className={css.user}>
        <div><strong>Нэр:</strong> {props.user.username}</div>
        <div><strong>Данс:</strong> {props.user.account}</div>
        <div><strong>Банк:</strong> {props.user.bankType}</div>
        <div><strong>Дансны нэр:</strong> {props.user.bankAccountName}</div>
        <div><strong>Үлдэгдэл:</strong> {props.user.balance}</div>
        <LoadingButton
            variant={"outlined"}
            onClick={() => setOpen(true)}>
            Үйлдэл
        </LoadingButton>
        <Window open={open} onClose={() => setOpen(false)}>
            <UpdateUser onSave={() => {
                props.onSave();
                setOpen(false);
            }} user={props.user}/>
        </Window>
    </Col>
}

function UpdateUser(props: { user: User, onSave: () => void }) {
    const [state, setState] = useState<User>(props.user);
    const [loading, setLoading] = useState(false);
    const dao = new AdminDAO();

    const onSave = async () => {
        setLoading(true);
        const response = await dao.saveUser(state);
        if (response.state === State.SUCCESS) {
            props.onSave();
            toast.success(response.message);
        } else toast.error(response.message);
        setLoading(false)
    }

    return <Col style={{background: "white", padding: "20px", borderRadius: "10px"}} gap={8}>
        <TextField
            label={"Данс"}
            value={state.account}
            onChange={(e) => setState({...state, account: e.target.value})}
        />
        <Autocomplete
            value={state.bankType}
            options={["Хаан банк", "Голомт банк", "Төрийн банк", "Хас банк", "Х/Хөгжлийн банк"]}
            renderInput={(params) => <TextField {...params} label="Банк"/>}
            disableClearable={true}
            onChange={(e, value) => setState({...state, bankType: value})}
        />
        <TextField
            label={"Дансны нэр"}
            value={state.bankAccountName}
            onChange={(e) => setState({...state, bankAccountName: e.target.value})}
        />
        <LoadingButton
            loading={loading}
            variant={"outlined"}
            onClick={onSave}>
            Хадгалах
        </LoadingButton>
    </Col>
}
