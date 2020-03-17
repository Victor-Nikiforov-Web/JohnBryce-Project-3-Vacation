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

interface AddVacationState {
    vacation: VacationModel;
    user: UserModel;
    departingDate: Date;
    returningDate: Date;
    imgToDisplay: string;
}
export class EditVacation extends Component<any, AddVacationState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            imgToDisplay: '',
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
        const id = this.props.match.params.id;
        fetch(`http://localhost:3000/api/vacations/${id}`)
            .then(res => res.json())
            .then(vacation => {
                this.setState({ vacation })
                this.setState({ imgToDisplay: vacation.image });
            })
            .catch(err => alert(err));
    }
    private updateDestination = (args: SyntheticEvent) => {
        const input = (args.target as HTMLSelectElement);
        const destination = input.value;
        const vacation = { ...this.state.vacation };
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
            this.setState({ departingDate: null });
            vacation.fromDate = null;
            this.setState({ vacation });
            return;
        }
        vacation.fromDate = date.toString();
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
        vacation.toDate = date.toString();
        this.setState({ vacation });
        this.setState({ returningDate: date });
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
        const vacation = { ...this.state.vacation };
        vacation.image = image;
        this.setState({ vacation });
    }

    private uplodeImg = async () => {
        const vacation = { ...this.state.vacation };
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', vacation.image);

            const optionsImg = {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                body: formData
            };

            fetch('http://localhost:3000/api/image-uplode', optionsImg)
                .then(res => res.json())
                .then(image => resolve(image))
                .catch(err => reject(err))
        });
    }

    private checkForm = async () => {
        const vacation = { ...this.state.vacation };
        // validation
        if (vacation.fromDate === vacation.toDate) {
            alert('Departing date cant be the same as returning date');
            return;
        }
        if (!vacation.image) {
            alert('You need to uplode image !');
            return;
        }
        if (vacation.description === undefined || vacation.destination === undefined ||
            vacation.fromDate === undefined || vacation.fromDate === null ||
            vacation.toDate === undefined || vacation.toDate === null || vacation.price === undefined) {
            alert('please fix all inputs / enter valid values .');
            return;
        }
        if (typeof vacation.image !== typeof "") {
            await this.uplodeImg()
                .then(image => {
                    vacation.image = image.toString();
                    this.setState({ vacation });
                    this.sendForm();
                })
                .catch(err => alert(err));
            return;
        }
        this.sendForm();
    }

    private sendForm = () => {
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify({ ...this.state.vacation })
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
                                            onChange={this.updateDestination} />
                                    </td>
                                    <td>
                                        <p>description : </p>
                                    </td>
                                    <td>
                                        <TextField
                                            value={this.state.vacation.description || ''}
                                            multiline
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
                                            variant="filled" onChange={this.updatePrice} />
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