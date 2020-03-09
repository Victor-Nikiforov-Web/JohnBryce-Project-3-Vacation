import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";

export class AppState {
    public user: UserModel = new UserModel();
    public isLogin: boolean = false;
    public vacations: VacationModel[] = [];
    public followedVacations: VacationModel[] = [];
}