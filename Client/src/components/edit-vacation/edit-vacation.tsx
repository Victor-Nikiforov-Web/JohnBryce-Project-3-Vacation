import React, { SyntheticEvent } from 'react';
import './edit-vacation.css';
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
import io from 'socket.io-client';

interface AddVacationState {
    vacation: VacationModel;
    user: UserModel;
    imgToDisplay: string;
    newImage: any;
}
export class EditVacation extends Component<any, AddVacationState> {
    private unsubscribeStore: Unsubscribe;
    private socket = io.connect("http://localhost:3000");
    public constructor(props: any) {
        super(props);
        this.state = {
            imgToDisplay: '',
            user: store.getState().user,
            vacation: new VacationModel(),
            newImage: ''
        }

        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ user: store.getState().user });
        });
    }

    public componentWillUnmount = () => {
        this.unsubscribeStore();
        
    }

    public componentDidMount = () => {
        const id = this.props.match.params.id;
        fetch(`http://localhost:3000/api/vacations/${id}`)
            .then(res => res.json())
            .then(vacation => {
                vacation.fromDate = new Date(vacation.fromDate);
                vacation.toDate = new Date(vacation.toDate);
                this.setState({ vacation })
                this.setState({ imgToDisplay: vacation.image });
            })
            .catch(err => alert(err));
    }
    private updateDestination = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const destination = input.value;
        const vacation = { ...this.state.vacation };
        input.id = '';
        vacation.destination = destination;
        this.setState({ vacation });
    }
    private updateDescription = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const description = input.value;
        const vacation = { ...this.state.vacation };
        vacation.description = description;
        this.setState({ vacation });
    }
    private updateDepartingDate = (date: Date, e: any) => {
        const vacation = { ...this.state.vacation };
        if (date === null || date.toString() === 'Invalid Date') {
            vacation.fromDate = null;
            this.setState({ vacation });
            return;
        }
        vacation.fromDate = date;
        this.setState({ vacation });
    }
    private updateReturningDate = (date: Date, e: any) => {
        const vacation = { ...this.state.vacation };
        if (date === null || date.toString() === 'Invalid Date') {
            vacation.toDate = null;
            this.setState({ vacation });
            return;
        }
        vacation.toDate = date;
        this.setState({ vacation });
    }
    private updatePrice = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const price = input.value;
        const vacation = { ...this.state.vacation };
        if (price.length < 1 || price.length > 6 || isNaN(+price)) {
            input.id = 'error';
            vacation.price = undefined;
            this.setState({ vacation });
            return;
        }
        input.id = '';
        vacation.price = +price;
        this.setState({ vacation });
    }
    private checkImage = (event: any) => {
        const image = event.target.files[0];
        this.setState({ newImage: image });
    }


    private checkForm = async () => {
        const vacation = { ...this.state.vacation };
        // validation
        if (vacation.destination.length < 3 || vacation.destination.length > 50) {
            vacation.destination = null;
            alert('fix destination input');
            return;
        }
        if (vacation.description.length < 4 || vacation.description.length > 300) {
            vacation.description = null;
            alert('fix description input');
            return;
        }
        if (vacation.fromDate > vacation.toDate) {
            alert('Returning date cannot be before departing !');
            return;
        }
        if (vacation.fromDate === vacation.toDate) {
            alert('Departing date cant be the same as returning date');
            return;
        }

        if (vacation.description === undefined || vacation.destination === undefined ||
            vacation.fromDate === undefined || vacation.fromDate === null ||
            vacation.toDate === undefined || vacation.toDate === null || vacation.price === undefined) {
            alert('please fix all inputs / enter valid values .');
            return;
        }

        this.sendForm();
    }

    private sendForm = () => {
        const vacation = { ...this.state.vacation };
        const formData = new FormData();
        formData.append('image', this.state.newImage)
        formData.append('vacation', JSON.stringify(vacation))

        const options = {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            },
            body: formData
        };

        fetch('http://localhost:3000/api/vacations/update-vacation', options)
            .then(res => res.json())
            .then(vacation => {
                const action: Action = {
                    type: ActionType.updateVacation,
                    payload: vacation
                };
                store.dispatch(action);

                alert('vacation has been updated !');
                this.props.history.push("/admin-panel");
                this.socket.emit("get-all-vacations");
            })
            .catch(err => alert(err));

    }
    public render(): JSX.Element {
        return (
            <div className='editVacation'>
                {this.state.user.isAdmin ?
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>destination :</p>
                                    </td>
                                    <td>
                                        <TextField value={this.state.vacation.destination || ''} variant="filled"
                                            onChange={this.updateDestination}
                                            helperText="Type between 3-50 characters"
                                        />
                                    </td>
                                    <td>
                                        <p>description : </p>
                                    </td>
                                    <td>
                                        <TextField
                                            value={this.state.vacation.description || ''}
                                            multiline
                                            helperText="Type between 4-300 characters"
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
                                                    format="dd/MM/yyyy"
                                                    value={this.state.vacation.fromDate}
                                                    onChange={this.updateDepartingDate}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    </td>
                                    <td>
                                        <p>Returning : </p>
                                    </td>
                                    <td>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    format="dd/MM/yyyy"
                                                    value={this.state.vacation.toDate}
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
                                        <TextField label="price" value={this.state.vacation.price || ''}
                                            variant="filled"
                                            helperText="Type between 1-6 characters"
                                            onChange={this.updatePrice} />
                                    </td>
                                    <td>
                                        <p>Image : </p>
                                    </td>
                                    <td><img src={`/assets/images/vacations/${this.state.imgToDisplay}`} alt='old' /></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input
                                            accept="image/*"
                                            className="imageUplode"
                                            id="outlined-button-file"
                                            multiple
                                            type="file"
                                            name="imageToUplode"
                                            onChange={this.checkImage}
                                        />
                                        <label htmlFor="outlined-button-file">
                                            <Button variant="outlined" component="span">
                                                Upload new image
                                             </Button>
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                        <Button variant="contained" color="primary" onClick={() => this.props.history.push("/admin-panel")}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="secondary" onClick={this.checkForm}>
                            Update Vacation
                      </Button>
                    </form>
                    : <PageNotFound />
                }
            </div >
        );
    }
}