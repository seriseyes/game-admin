import BaseDAO from "../utils/BaseDAO";
import {Response} from "../models/Response";
import {User} from "../views/users/Users";

export default class AdminDAO extends BaseDAO {
    async login(dto: { username: string, password: string }) {
        return super.post<Response>("/login", dto);
    }

    async findAllRequests(model: string) {
        return super.get<Response>(`/requests?model=${model}`);
    }

    async submitRequest(id: number, action: string) {
        return super.get<Response>(`/requests/submit?id=${id}&action=${action}`);
    }

    async findAllUsers() {
        return super.getList<User>("/users");
    }

    async saveUser(user: User) {
        return super.post<Response>("/save/user", user);
    }

    async getArticle() {
        return super.get<Response>("/article/get");
    }

    async updateArticle(value: string) {
        return super.post<Response>("/article/update", {value});
    }
}

