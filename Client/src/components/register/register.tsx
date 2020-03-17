import React, { Component, SyntheticEvent } from 'react';
import './register.css';
import { TextField, Button } from '@material-ui/core';
import { UserModel } from '../../models/user-model';
import { store } from "../../redux/store";
import { Action } from "../../redux/action";
import { ActionType } from "../../redux/action-type";
import { Unsubscribe } from "redux";
import { PageNotFound } from '../page-not-found/page-not-found';


interface RegisterState {
    user: UserModel;
    isLogin: boolean;
}

export class RegisterPage extends Component<any, RegisterState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: new UserModel(),
            isLogin: store.getState().isLogin
        }
        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ isLogin: store.getState().isLogin });
        });
    }

    public componentWillUnmount = () => {
        this.unsubscribeStore();
    }
    private updateFirstName = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const firstName = input.value;
        const user = { ...this.state.user };
        if (firstName.length < 2 || firstName.length > 30) {
            input.id = 'error';
            user.firstName = undefined;
            this.setState({ user });
            return;
        }
        input.id = '';
        user.firstName = firstName;
        this.setState({ user });
    }

    private updateLastName = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const lastName = input.value;
        const user = { ...this.state.user };
        if (lastName.length < 2 || lastName.length > 30) {
            input.id = 'error';
            user.lastName = undefined;
            this.setState({ user });
            return;
        }
        input.id = '';
        user.lastName = lastName;
        this.setState({ user });
    }
    private updateUserName = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const userName = input.value;
        const user = { ...this.state.user };
        if (userName.length < 2 || userName.length > 30) {
            input.id = 'error';
            user.userName = undefined;
            this.setState({ user });
            return;
        }
        input.id = '';
        user.userName = userName;
        this.setState({ user });
    }

    private updatePassword = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const password = input.value;
        const user = { ...this.state.user };
        if (password.length < 4 || password.length > 30) {
            input.id = 'error';
            user.password = undefined;
            this.setState({ user });
            return;
        }
        input.id = '';
        user.password = password;
        this.setState({ user });
    }

    private sendForm = () => {
        // check if from valid
        const user = this.state.user;
        if (user.firstName === undefined || user.lastName === undefined || user.userName === undefined ||
            user.password === undefined) {
            alert('please fix the red / empty inputs !');
            return;
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.user)
        };

        fetch("http://localhost:3000/api/register", options)
            .then(async response => {
                if (!response.ok)
                    throw new Error(await response.text());
                return response;
            })
            .then(response => response.json())
            .then(user => {
                this.props.history.push("/");

                const actionUser: Action = {
                    type: ActionType.getUser,
                    payload: user
                };
                store.dispatch(actionUser);

                const actionIsLogin: Action = {
                    type: ActionType.updateIsLogin,
                    payload: true
                };
                store.dispatch(actionIsLogin);
                this.sendJWT();
            })
            .catch(err => alert(err));
    }

    private sendJWT = () => {
        const optionsJWT = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(store.getState().user)
        };
        // save to JWT 
        fetch("http://localhost:3000/api/login/login-save", optionsJWT)
            .then(response => response.json())
            // save in localstorage for auto login with unique token
            .then(res => localStorage.setItem('token', res.token))
            .catch(err => alert(err));
    }

    public render(): JSX.Element {
        return (
            <div className='registerPage'>
                {this.state.isLogin === false ?
                    <form>
                        <label>
                            <p>First Name :</p>
                            <TextField onChange={this.updateFirstName}
                                label="First Name"
                                variant="filled"
                                size="small"
                                helperText="Type between 2-30 characters"
                            />
                        </label>
                        <label>
                            <p>Last Name :</p>
                            <TextField onChange={this.updateLastName}
                                label="Last Name"
                                variant="filled"
                                size="small"
                                helperText="Type between 2-30 characters"
                            />
                        </label>
                        <label>
                            <p>User Name :</p>
                            <TextField onChange={this.updateUserName}
                                label="User Name"
                                variant="filled"
                                size="small"
                                helperText="Type between 2-30 characters"
                            />
                        </label>
                        <label>
                            <p>Password :</p>
                            <TextField onChange={this.updatePassword}
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="filled"
                                size="small"
                                helperText="Type between 4-30 characters"
                            />
                        </label>
                        <Button variant="contained" color="secondary" onClick={this.sendForm}>Register !</Button>
                    </form>
                    :
                    <PageNotFound />}
            </div>
        );
    }
}