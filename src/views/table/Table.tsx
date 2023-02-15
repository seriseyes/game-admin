import Row from "../../components/layouts/Row";
import React, {useEffect, useState} from "react";
import AdminDAO from "../../dao/AdminDAO";
import {useLocation} from "react-router-dom";
import css from "./Table.module.css";
import Col from "../../components/layouts/Col";
import {LoadingButton} from "@mui/lab";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import {Response, State} from "../../models/Response";
import {toast} from "react-toastify";

export interface Table {
    id: number;
    username: string;
    bank: string;
    account: string;
    amount: number;
    created: string;
}

export default function Table() {
    const dao = new AdminDAO();
    const location = useLocation();
    const [state, setState] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [location]);

    const fetchData = async () => {
        setLoading(true);
        const data = await dao.findAllRequests(location.pathname.includes('deposit') ? 'Мөнгө байршуулах хүсэлт' : 'Мөнгө татан авах хүсэлт');
        setState(data.data);
        setLoading(false);
    }

    return <Col gap={10}>
        {loading && <div className={css.loading}>Уншиж байна...</div>}
        <Row className={css.wrap} gap={10}>

            {state.map((el, i) => <Item key={i} el={el} onSubmit={dao.submitRequest} onSuccess={fetchData}/>)}
        </Row>
    </Col>
}

function Item(props: { el: Table, onSubmit: (id: number) => Promise<Response> , onSuccess: () => void}) {
    const [loadingButton, setLoadingButton] = useState(false);

    const onClick = async () => {
        setLoadingButton(true);
        const response = await props.onSubmit(props.el.id);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
            props.onSuccess();
        } else toast.error(response.message);
        setLoadingButton(false);
    }

    return <div>
        <div className={css.item}>
            <div>Нэр: {props.el.username}</div>
            <div>Банк: {props.el.bank}</div>
            <div>Данс: {props.el.account}</div>
            <div>Мөнгө: {props.el.amount}</div>
            <LoadingButton
                loading={loadingButton}
                variant={"outlined"}
                endIcon={<NavigateNextOutlinedIcon/>}
                onClick={onClick}>
                Батлах
            </LoadingButton>
        </div>
    </div>
}
