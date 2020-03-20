import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

export function reducer(oldState: AppState, action: Action): AppState {

    const newState = { ...oldState };

    switch (action.type) {

        case ActionType.getUser:
            newState.user = action.payload;
            break;

        case ActionType.updateIsLogin:
            newState.isLogin = action.payload;
            break;

        case ActionType.getAllVacations:
            newState.vacations = action.payload;
            break;

        case ActionType.getFollowedVacations:
            newState.followedVacations = action.payload;
            break;

        case ActionType.addNewVacation:
            newState.vacations.push(action.payload);
            break;

        case ActionType.deleteVacation:
            const indexToDelete = newState.vacations.findIndex(v => v.vacationID === action.payload);
            newState.vacations.splice(indexToDelete, 1);
            break;

        case ActionType.updateVacation:
            const index = newState.vacations.findIndex(v => v.vacationID === action.payload.vacationID);
            newState.vacations[index] = action.payload;
            break;
    }

    return newState;
}
