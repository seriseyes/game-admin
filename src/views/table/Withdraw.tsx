import AdminDAO from "../../dao/AdminDAO";
import Grid from "../../components/grid/Grid";
import React, {useState} from "react";
import {Table} from "./Deposit";
import {State} from "../../models/Response";
import {toast} from "react-toastify";
import Row from "../../components/layouts/Row";
import {LoadingButton} from "@mui/lab";

export default function Withdraw() {
    const dao = new AdminDAO();
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        return new Promise<Table[]>(async (resolve) => {
            const response = await dao.findAllRequests('Мөнгө татан авах хүсэлт');
            resolve(response.data);
        });
    }

    const onClick = async (id: number, action: string) => {
        setLoading(true);
        const response = await dao.submitRequest(id, action);
        if (response.state === State.SUCCESS) {
            toast.success(response.message);
        } else toast.error(response.message);
        setLoading(false);
    }

    return <Grid fetcher={fetchData} searchLabel={"Нэрээр хайх"} columns={[
        {name: <strong>Нэр</strong>, selector: (row: Table) => row.username},
        {name: <strong>Банк</strong>, selector: (row: Table) => row.bankId},
        {name: <strong>Данс</strong>, selector: (row: Table) => row.account},
        {name: <strong>Мөнгө</strong>, selector: (row: Table) => row.amount},
        {
            name: <strong style={{textAlign: "center", width: "100%"}}>Үйлдэл</strong>,
            cell: (row: Table) => <Row gap={4}>
                <LoadingButton
                    size={"small"}
                    variant={"outlined"}
                    onClick={() => onClick(row.id, 'approve')}
                    loading={loading}
                >
                    Батлах
                </LoadingButton>
                <LoadingButton
                    size={"small"}
                    color={"error"}
                    variant={"outlined"}
                    onClick={() => onClick(row.id, 'decline')}
                    loading={loading}
                >
                    Татгалзах
                </LoadingButton>
            </Row>
        }
    ]}/>
}
