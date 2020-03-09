import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { UserModel } from '../../models/user-model';
//redux
import { store } from "../../redux/store";
import { Action } from "../../redux/action";
import { ActionType } from "../../redux/action-type";
import { Unsubscribe } from "redux";

interface NavBarLoginState {
    user: UserModel;
    isLogin: boolean;
}
export class NavBarLogin extends Component<any, NavBarLoginState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: store.getState().user,
            isLogin: store.getState().isLogin
        };
        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ user: store.getState().user });
            this.setState({ isLogin: store.getState().isLogin });
        });
    }
    private logout = () => {
        const actionUser: Action = {
            type: ActionType.getUser,
            payload: new UserModel()
        };
        store.dispatch(actionUser);

        const actionIsLogin: Action = {
            type: ActionType.updateIsLogin,
            payload: false
        };
        store.dispatch(actionIsLogin);
        localStorage.removeItem("token");
    }
    public componentWillUnmount = () => {
        this.unsubscribeStore();
    }
    public render(): JSX.Element {

        return (
            <div className='navbarLogin'>
                <Grid container spacing={3}>
                    {this.state.user.isAdmin === 1 ?
                        <React.Fragment>
                            <Grid item xs={6} md={4} className='welcomeMsg'>
                                <p>Hello {this.state.user.firstName} {this.state.user.lastName} !</p>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Button variant="contained">Manage Vacations</Button>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Button variant="contained">Test</Button>
                            </Grid>
                        </React.Fragment>
                        :
                        <Grid item xs={6} md={10} className='welcomeMsg'>
                            <p>Hello {this.state.user.firstName} {this.state.user.lastName} !</p>
                        </Grid>}
                    <Grid item xs={6} md={2}>
                        <Button variant="contained" color="secondary"
                            onClick={this.logout}>Logout</Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
