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
    public componentDidMount = () => {
        if (store.getState().vacations.length < 1) {
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
    private deleteVacation = (vacation: VacationModel) => {
        const answer = window.confirm("Are you sure?");
        if (!answer) {
            return;
        }

        const options = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(vacation)
        };

        fetch(`http://localhost:3000/api/vacations/delete-vacation`, options)
            .then(() => {
                alert("Vacation has been successfully deleted.");
                const action: Action = {
                    type: ActionType.deleteVacation,
                    payload: vacation.vacationID
                };
                store.dispatch(action);
            })
            .catch(err => alert(err.message));
    }

    public render(): JSX.Element {
        return (
            <div className='adminPanel'>
                {!this.state.user.isAdmin ? <PageNotFound /> :
                    <React.Fragment>
                        <Button variant="contained" color="primary">
                            <AddIcon />
                            <NavLink to='/add-vacation' exact>Add Vacation</NavLink>
                        </Button>
                        <Button variant="contained" color="primary">
                            <EqualizerIcon />
                            <NavLink to='/chart'>Reports</NavLink>
                        </Button>
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
                                            <NavLink to={`/edit-vacation/${v.vacationID}`} exact>
                                                <EditIcon />
                                            </NavLink>
                                        </td>
                                        <td>
                                            <RemoveIcon onClick={() => this.deleteVacation(v)} />
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </React.Fragment>
                }
            </div>
        );
    }
}