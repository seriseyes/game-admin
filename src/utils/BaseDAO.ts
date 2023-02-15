import axios from "./AxiosInstance";
import {Response, State} from "../models/Response";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

abstract class BaseDAO {

    protected async post<T>(url: string, model: any): Promise<T> {
        try {
            const response = await axios.post<Response>(url, model);
            handleResponse(response.data, "POST");
            return response.data as T;
        } catch (err: any) {
            handleError(err);
        }
        return {} as T;
    }

    protected async get<T>(url: string): Promise<T> {
        try {
            const response = await axios.get<Response>(url);
            handleResponse(response.data);
            return response.data as T;
        } catch (err: any) {
            handleError(err);
        }
        return {} as T;
    }

    protected async getList<T>(url: string): Promise<Array<T>> {
        try {
            const response = await axios.get<Response>(url);
            handleResponse(response.data);
            return response.data as unknown as T[];
        } catch (err: any) {
            handleError(err);
            return [];
        }
    }

}

function handleResponse(response: Response, method: string = "GET") {
    if (response.state !== State.SUCCESS) {
        toast.error(response.message, {toastId: response.message});
    } else if (method === 'POST') {
        toast.success(response.message, {toastId: response.message});
    }
}

function handleError(err: AxiosError) {
    if (!err.response) {
        toast.error("Тодорхойгүй алдаа гарлаа [console]");
        console.error(err);
        return;
    }

    switch (err.response.status) {
        case 401:
            toast.info("Дахин нэвтэрнэ үү.");
            window.location.href = "/";
            return;
    }
    toast.error(err.message);
}


export default BaseDAO;
