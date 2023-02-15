import Col from "../../components/layouts/Col";
import {createBrowserRouter, Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import Login from "../auth/Login";
import {toast} from "react-toastify";
import Row from "../../components/layouts/Row";
import css from "./Menu.module.css";
import Table from "../table/Table";
import Users from "../users/Users";
import Article from "../article/Article";

function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (!username) navigate("login");
        else {
            navigate("deposit");
            toast.info("Тавтай морилно уу, " + username);
        }
    }, [username]);

    return <Row gap={20} className={css.wrap}>
        <Col className={css.menu} gap={4}>
            <Link className={`${css.link} ${location.pathname.includes("deposit") ? css.linkActive : ""}`}
                  to={"/deposit"}>Данс цэнэглэх</Link>
            <Link className={`${css.link} ${location.pathname.includes("withdraw") ? css.linkActive : ""}`}
                  to={"/withdraw"}>Мөнгө татах</Link>
            <Link className={`${css.link} ${location.pathname.includes("users") ? css.linkActive : ""}`}
                  to={"/users"}>Хэрэглэгч</Link>
            <Link className={`${css.link} ${location.pathname.includes("article") ? css.linkActive : ""}`}
                  to={"/article"}>Мэдээ</Link>
        </Col>
        <div className={css.container}>
            <Outlet/>
        </div>
    </Row>
}

export const Routers = createBrowserRouter([
    {
        path: '/',
        element: <Menu/>,
        children: [
            {
                path: "deposit",
                element: <Table/>
            },
            {
                path: "withdraw",
                element: <Table/>
            },
            {
                path: "users",
                element: <Users/>
            },
            {
                path: "article",
                element: <Article/>
            }
        ]
    },
    {
        path: 'login',
        element: <Login/>
    }
]);
