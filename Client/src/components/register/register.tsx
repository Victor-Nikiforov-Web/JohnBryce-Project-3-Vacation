import React, { Component, SyntheticEvent } from 'react';
import './register.css';
import { TextField, Button } from '@material-ui/core';
import { UserModel } from '../../models/user-model';

interface RegisterState {
    user: UserModel;
}

export class RegisterPage extends Component<any, RegisterState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            user: new UserModel()
        }
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
        const user = this.state.user
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
                alert('Registration successful !')
                this.props.history.push("/");
            })
            .catch(err => alert(err));
    }

    public render(): JSX.Element {
        return (
            <div className='registerPage'>
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
                    <Button variant="contained" onClick={this.sendForm}>Register !</Button>
                </form>
            </div>
        );
    }
}