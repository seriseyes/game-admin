import React, {useEffect, useState} from "react";
import AdminDAO from "../../dao/AdminDAO";
import {State} from "../../models/Response";
import {toast} from "react-toastify";
import {TextareaAutosize} from "@mui/material";
import Col from "../../components/layouts/Col";
import {LoadingButton} from "@mui/lab";

export default function Article() {
    const [state, setState] = useState('');
    const [loading, setLoading] = useState(false);
    const dao = new AdminDAO();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const response = await dao.getArticle();
        if (response.state === State.SUCCESS) {
            setState(response.data);
        } else toast.error(response.message);
        setLoading(false);
    }

    const onSave = async () => {
        const response = await dao.updateArticle(state);
        if (response.state !== State.SUCCESS) {
            toast.error(response.message)
        }
    }

    return <Col style={{width: "300px"}} gap={5}>
        <TextareaAutosize
            value={state}
            minRows={10}
            onChange={(e: any) => setState(e.target.value)}
        />
        <LoadingButton
            sx={{width: "300px"}}
            loading={loading}
            variant={"outlined"}
            onClick={onSave}>
            Хадгалах
        </LoadingButton>
    </Col>
}
