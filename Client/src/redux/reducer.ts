import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

// Reducer - פונקציה המבצעת את הפעולה הדרושה על המידע
// פונקציה זו צריכה לקבל שני פרמטרים:
// AppState-פרמטר ראשון - אובייקט ה
// Action-פרמטר שני - אובייקט ה
// שנשלח אליה AppState-אבל - אסור לפונקציה לשנות את ה
// חדש, לשנות אותו ולהחזיר אותו AppState לכן היא חייבת לייצר

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
    }

    return newState;
}