import {TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import css from "./Auth.module.css";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import {useNavigate} from "react-router-dom";
import AdminDAO from "../../dao/AdminDAO";
import {State} from "../../models/Response";
import {toast} from "react-toastify";
import {LoadingButton} from "@mui/lab";

export default function Login() {
    const navigate = useNavigate();
    const dao = new AdminDAO();

    const [state, setState] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        setLoading(true);
        const response = await dao.login(state);
        if (response.state === State.SUCCESS) {
            localStorage.setItem('username', response.data);
            navigate("/");
        } else toast.error(response.data, {toastId: "login"});
        setLoading(false);
    }

    const onChange = (e: any) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        localStorage.clear();
    }, []);

    return <div className={css.wrap}>
        <TextField label={"Нэвтрэх нэр"} name={"username"} onChange={onChange}/>
        <TextField label={"Нууц үг"} name={"password"} onChange={onChange} type={"password"}/>
        <LoadingButton
            loading={loading}
            variant={"outlined"}
            endIcon={<NavigateNextOutlinedIcon/>}
            onClick={onLogin}
        >
            Нэвтрэх
        </LoadingButton>
    </div>
}
