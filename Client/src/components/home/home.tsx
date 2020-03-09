import React, { Component } from 'react';
import './home.css';
import { VactionBox } from '../vaction-box/vaction-box';
import { VacationModel } from '../../models/vacation-model';
import Grid from '@material-ui/core/Grid';
import { UserModel } from '../../models/user-model';
//redux
import { store } from "../../redux/store";
import { Action } from "../../redux/action";
import { ActionType } from "../../redux/action-type";
import { Unsubscribe } from "redux";

interface HomeState {
    vacations: VacationModel[];
    user: UserModel;
    isLogin: boolean;
    followedVacations: VacationModel[];
}

export class Home extends Component<any, HomeState> {
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            user: store.getState().user,
            isLogin: store.getState().isLogin,
            followedVacations: store.getState().followedVacations
        };

        this.unsubscribeStore = store.subscribe(() => {
            this.setState({ user: store.getState().user });
            this.setState({ vacations: store.getState().vacations });
            this.setState({ isLogin: store.getState().isLogin });
            this.setState({ followedVacations: store.getState().followedVacations });
        });
    }

    public componentWillUnmount = () => {
        this.unsubscribeStore();
    }
    public componentDidMount = () => {
        // if user not connected .
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

    //fix format of date that mySQL return
    private fixDateFromMySQL = (str: any) => {
        const index = str.indexOf("T");
        const newStr = str.slice(0, index);
        return newStr;
    }
    public render(): JSX.Element {

        if (this.state.isLogin === true) {
            fetch(`http://localhost:3000/api/vacations/get-followed-vacations/${this.state.user.userID}`)
                .then(res => res.json())
                .then(followedVacations => {

                    const action: Action = {
                        type: ActionType.getFollowedVacations,
                        payload: followedVacations
                    };
                    store.dispatch(action);
                })
                .catch(err => console.log(err));
        }
        return (
            <div className='home'>
                <button onClick={() => console.log(this.state.followedVacations)}>Click</button>
                <Grid container spacing={3}>
                    {this.state.vacations.map(v =>
                        <Grid item xs={12} md={4} key={v.vacationID} >
                            <VactionBox id={v.vacationID} image={v.image} header={v.destination} content={v.description}
                                fromDate={this.fixDateFromMySQL(v.fromDate)} toDate={this.fixDateFromMySQL(v.toDate)}
                                price={v.price} />
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }
}