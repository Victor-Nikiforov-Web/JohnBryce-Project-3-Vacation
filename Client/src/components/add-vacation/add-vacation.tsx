import React, { SyntheticEvent } from 'react';
import './add-vacation.css';
import { VacationModel } from '../../models/vacation-model';
import { UserModel } from '../../models/user-model';
import { Component } from 'react';
import { store } from "../../redux/store";
import { Action } from "../../redux/action";
import { ActionType } from "../../redux/action-type";
import { Unsubscribe } from "redux";
import { PageNotFound } from '../page-not-found/page-not-found';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

interface AddVacationState {
    vacation: VacationModel;
    user: UserModel;
    departingDate: Date;
    returningDate: Date;
}
export class AddVacation extends Component<any, AddVacationState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            user: store.getState().user,
            vacation: new VacationModel(),
            departingDate: new Date(),
            returningDate: new Date()
        }

        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ user: store.getState().user });
        });
    }

    public componentWillUnmount = () => {
        this.unsubscribeStore();
    }

    public componentDidMount = () => {

    }
    private updateDestination = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const destination = input.value;
        const vacation = { ...this.state.vacation };
        if (destination.length < 3 || destination.length > 50) {
            input.id = 'error';
            vacation.destination = undefined;
            this.setState({ vacation });
            return;
        }
        input.id = '';
        vacation.destination = destination;
        this.setState({ vacation });
    }
    private updateDescription = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const description = input.value;
        const vacation = { ...this.state.vacation };
        if (description.length < 5 || description.length > 300) {
            input.id = 'error';
            vacation.description = undefined;
            this.setState({ vacation });
            return;
        }
        input.id = '';
        vacation.description = description;
        this.setState({ vacation });
    }
    private updateDepartingDate = (date: Date, e: any) => {
        const vacation = { ...this.state.vacation };

        if (date === null || date.toString() === 'Invalid Date') {
            this.setState({ departingDate: null });
            vacation.fromDate = null;
            this.setState({ vacation });
            return;
        }
        vacation.fromDate = e;
        this.setState({ vacation });
        this.setState({ departingDate: date });
    }
    private updateReturningDate = (date: Date, e: any) => {
        const vacation = { ...this.state.vacation };

        if (date === null || date.toString() === 'Invalid Date') {
            this.setState({ returningDate: null });
            vacation.toDate = null;
            this.setState({ vacation });
            return;
        }
        vacation.toDate = e;
        this.setState({ vacation });
        this.setState({ returningDate: date });
    }
    private updatePrice = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const price = input.value;
        const vacation = { ...this.state.vacation };
        if (price.length < 1 || price.length > 6) {
            input.id = 'error';
            vacation.price = undefined;
            this.setState({ vacation });
            return;
        }
        input.id = '';
        vacation.price = +price;
        this.setState({ vacation });
    }
    public render(): JSX.Element {
        return (
            <div className='addVacation'>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>destination :</p>
                                </td>
                                <td>
                                    <TextField label="destination" variant="filled"
                                        onChange={this.updateDestination} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>description : </p>
                                </td>
                                <td>
                                    <TextField
                                        id="filled-textarea"
                                        label="description"
                                        multiline
                                        variant="filled"
                                        onChange={this.updateDescription}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Departing : </p>
                                </td>
                                <td>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
                                            <KeyboardDatePicker
                                                margin="normal"
                                                label="Date picker dialog"
                                                format="dd/MM/yyyy"
                                                value={this.state.departingDate}
                                                onChange={this.updateDepartingDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Returning : </p>
                                </td>
                                <td>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
                                            <KeyboardDatePicker
                                                margin="normal"
                                                label="Date picker dialog"
                                                format="dd/MM/yyyy"
                                                value={this.state.returningDate}
                                                onChange={this.updateReturningDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Price : </p>
                                </td>
                                <td>
                                    <TextField label="price" variant="filled" onChange={this.updatePrice} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Upload image</p>
                                </td>
                                <td>
                                    <input
                                        accept="image/*"
                                        className="imageUplode"
                                        id="outlined-button-file"
                                        multiple
                                        type="file"
                                    />
                                    <label htmlFor="outlined-button-file">
                                        <Button variant="outlined" component="span">
                                            Upload
                                           </Button>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Button variant="contained" color="secondary">
                        Add Vacation
                    </Button>
                </form>
            </div >
        );
    }
}