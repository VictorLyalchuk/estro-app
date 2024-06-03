import {Status} from "../../utils/enums";
import { IUser } from "./IUser";

export interface IAccountState {
    user: IUser | null,
    token: string | null,
    isLogin: boolean,
    status: Status;
}
