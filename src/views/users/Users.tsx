import AdminDAO from "../../dao/AdminDAO";
import React, {useState} from "react";
import {State} from "../../models/Response";
import {toast} from "react-toastify";
import Col from "../../components/layouts/Col";
import {LoadingButton} from "@mui/lab";
import Window from "../../components/window/Window";
import {Autocomplete, TextField} from "@mui/material";
import Grid from "../../components/grid/Grid";

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
    const [open, setOpen] = useState<{ open: boolean, user?: User }>({
        open: false
    });

    const filter = (row: User, value: string) => {
        return row.username.toLowerCase().includes(value.toLowerCase());
    }

    return <>
        <Grid fetcher={dao.findAllUsers} filter={filter} searchLabel={"Нэрээр хайх"} columns={[
            {name: <strong>Нэр</strong>, selector: (row: User) => row.username},
            {name: <strong>Данс</strong>, selector: (row: User) => row.account},
            {name: <strong>Банк</strong>, selector: (row: User) => row.bankType},
            {name: <strong>Данс эзэмшигчийн нэр</strong>, selector: (row: User) => row.bankAccountName},
            {name: <strong>Үлдэгдэл</strong>, selector: (row: User) => row.balance},
            {
                name: <strong>Үйлдэл</strong>, cell: (row: User) => <LoadingButton
                    variant={"outlined"}
                    onClick={() => setOpen({open: true, user: row})}>
                    Засах
                </LoadingButton>
            },
        ]}/>
        <Window open={open.open} onClose={() => setOpen({open: false, user: undefined})}>
            {open.user
                ? <UpdateUser onSave={() => setOpen({open: false, user: undefined})} user={open.user}/>
                : <></>}
        </Window>
    </>
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
        } else toast.error(response.message);
        setLoading(false)
    }

    return <Col style={{background: "white", padding: "20px", borderRadius: "10px"}} gap={8}>
        <TextField
            label={"Үлдэгдэл"}
            value={state.balance}
            type={"number"}
            onChange={(e) => setState({...state, balance: parseFloat(e.target.value)})}
        />
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
