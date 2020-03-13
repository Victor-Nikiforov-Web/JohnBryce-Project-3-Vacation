import React, { Component } from 'react';
import './admin-panel.css';
import { UserModel } from '../../models/user-model';
import { VacationModel } from '../../models/vacation-model';
import { store } from "../../redux/store";
import { Action } from "../../redux/action";
import { ActionType } from "../../redux/action-type";
import { Unsubscribe } from "redux";
import { PageNotFound } from '../page-not-found/page-not-found';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { NavLink } from 'react-router-dom';

interface AdminPanelState {
    user: UserModel;
    vacations: VacationModel[];
}

export class AdminPanel extends Component<any, AdminPanelState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: store.getState().user,
            vacations: store.getState().vacations
        }

        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ user: store.getState().user });
            this.setState({ vacations: store.getState().vacations });

        });
    }
    public componentDidUpdate = () => {
        if (store.getState().vacations.length === 0) {
            fetch('http://localhost:3000/api/vacations')
                .then(res => res.json())
                .then(vacations => {
                    const action: Action = {
                        type: ActionType.getAllVacations,
                        payload: vacations
                    };
                    store.dispatch(action);
                })
                .catch(err => alert(err));
        }
    }

    public componentWillUnmount = () => {
        this.unsubscribeStore();
    }
    public render(): JSX.Element {
        return (
            <div className='adminPanel'>
                <Button variant="contained" color="primary">
                    <AddIcon />
                    <NavLink to='/add-vacation' exact>Add Vacation</NavLink>
                </Button>
                <Button variant="contained" color="primary">
                    <EqualizerIcon />
                    Reports
                    </Button>
                {!this.state.user.isAdmin ? <PageNotFound /> :
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>destination</th>
                                <th>Price</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.vacations.map(v =>
                                <tr key={v.vacationID}>
                                    <td>{v.vacationID}</td>
                                    <td>{v.destination}</td>
                                    <td>{v.price} $</td>
                                    <td>
                                        <EditIcon />
                                    </td>
                                    <td>
                                        <RemoveIcon />
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                }
            </div>
        );
    }
}