import DataTable, {TableColumn} from 'react-data-table-component';
import {useEffect, useState} from "react";
import Col from "../layouts/Col";
import {IconButton, TextField} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import Row from "../layouts/Row";

export interface GridProps<T> {
    fetcher: () => Promise<T[]>;
    columns: TableColumn<T>[],
    filter?: (row: T, value: string) => boolean;
    searchLabel?: string;
}

export default function Grid<T>(props: GridProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [filtered, setFiltered] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const response = await props.fetcher();
        setData(response);
        setFiltered(response);
        setLoading(false);
    }

    useEffect(() => {
        setFiltered(data.filter(f => props.filter && props.filter(f, value)));
    }, [value]);

    const paginationOptions = {
        rowsPerPageText: '1 хуудсанд',
        rangeSeparatorText: ' нийт:',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Бүгд',
    };

    return <Col>
        <Row gap={10}>
            <IconButton
                sx={{border: "1px solid #1976D2", height: "35px", width: "35px"}}
                color={"primary"}
                onClick={fetchData}
            >
                <RefreshIcon/>
            </IconButton>
            {props.filter && <TextField
                sx={{width: "180px"}}
                size={"small"}
                label={props.searchLabel || "Хайх"}
                onChange={(e: any) => setValue(e.target.value)}
            />}
        </Row>
        <DataTable
            columns={props.columns.map(el => ({...el, sortable: true, wrap: true}))}
            data={filtered}
            pagination
            progressPending={loading}
            paginationComponentOptions={paginationOptions}
            persistTableHead
            noDataComponent={<div>Мэдээлэл байхгүй байна</div>}
            striped
            progressComponent={<h2>Ачааллаж байна...</h2>}
        />
    </Col>;
}
