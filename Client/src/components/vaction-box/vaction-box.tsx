import React, { Component } from 'react';
import './vaction-box.css';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
//redux
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { Action } from "../../redux/action";
import { ActionType } from "../../redux/action-type";

import { UserModel } from '../../models/user-model';
import { VacationModel } from '../../models/vacation-model';

interface VactionBoxState {
    vacations: VacationModel[];
    user: UserModel;
    isLogin: boolean;
    followedVacations: VacationModel[];
}
export class VactionBox extends Component<any, VactionBoxState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            user: store.getState().user,
            isLogin: store.getState().isLogin,
            followedVacations: store.getState().followedVacations
        }

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

    private followVacation = () => {
        if (this.state.isLogin === false) {
            alert('You have to log in to follow vacation');
            return;
        }
        const vacationID = +this.props.id;
        const userID = +this.state.user.userID;
        const sendInfo = { user: userID, vacation: vacationID };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(sendInfo)
        };

        fetch("http://localhost:3000/api/vacations/followVacation", options)
            .then(response => response.json())
            .then(res => {
                this.updateState();
            })
            .catch(err => alert(err));
    }

    private removeVacation = () => {
        const vacationID = +this.props.id;
        const userID = +this.state.user.userID;
        const options = {
            method: "DELETE"
        };

        fetch(`http://localhost:3000/api/vacations/delete/${vacationID}/${userID}`, options)
            .then(res => {
                const vacations = [...this.state.vacations]
                const vacation = vacations.find(v => v.vacationID === this.props.id);
                vacation.follow = false;
                this.setState({ vacations });
                this.updateState();

            })
            .catch(err => alert(err.message));
    }

    private updateState = () => {
        fetch(`http://localhost:3000/api/vacations/get-followed-vacations/${this.state.user.userID}`)
            .then(res => res.json())
            .then(followedVacations => {
                const action: Action = {
                    type: ActionType.getFollowedVacations,
                    payload: followedVacations
                };
                store.dispatch(action);
                this.props.update();
            })
            .catch(err => alert(err));
    }
    public render(): JSX.Element {
        return (
            <div className='vacationBox'>
                <Card className='root'>
                    <CardActionArea>
                        <CardMedia
                            className='media'
                            image={`/assets/images/vacations/${this.props.image}`}
                            title="img"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {this.props.header}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" >
                                {this.props.content}
                            </Typography>
                            <Typography id="date" color="textSecondary" component="p">
                                {this.props.fromDate} <span style={{ color: 'black', fontSize: '25px' }}>
                                    -</span> {this.props.toDate}
                            </Typography>
                            <Typography id="price" color="textSecondary" component="p">
                                {this.props.price} $
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    {this.state.user.isAdmin ? null :
                        <CardActions>
                            {!this.props.follow ?
                                <Button size="small" color="primary" onClick={this.followVacation}>
                                    <AddIcon />
                                    Follow this vacation
                         </Button>
                                :
                                <Button size="small" color="secondary" onClick={this.removeVacation}>
                                    <RemoveIcon />
                                    Unfollow this vacation
                     </Button>
                            }
                        </CardActions>
                    }
                </Card>
            </div>
        )
    };
}