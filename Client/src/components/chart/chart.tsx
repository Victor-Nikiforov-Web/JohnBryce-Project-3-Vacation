import React, { Component } from 'react';
import './chart.css';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { UserModel } from '../../models/user-model';
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { PageNotFound } from '../page-not-found/page-not-found';

interface ChartState {
  vacations: any[];
  tickValueArr: any[];
  tickFormatArr: any[];
  user: UserModel;
}

export class Chart extends Component<any, ChartState> {
  private unsubscribeStore: Unsubscribe;

  public constructor(props: any) {
    super(props);
    this.state = {
      user: store.getState().user,
      vacations: [],
      tickValueArr: [],
      tickFormatArr: []
    }
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({ user: store.getState().user });
    });
  }

  public componentWillUnmount = () => {
    this.unsubscribeStore();
  }
  public componentDidMount = () => {
    const options = {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    };

    fetch('http://localhost:3000/api/vacations/followed/get-all', options)
      .then(res => res.json())
      .then(vacations => this.arrangeVacations(vacations))
      .catch(err => alert(err));

    setTimeout(() => {
      this.arrangeTicksValueForChart();
      this.arrangeTicksFormatForChart();
    }, 1000)
  }

  private arrangeVacations = (vacations: any) => {
    const stateVacations = [...this.state.vacations];
    vacations.forEach((v: any) => {
      let obj = { vacationID: +v.vacationID, followers: 1 };
      const vacation = stateVacations.find((f) => f.vacationID === v.vacationID);
      if (vacation) {
        vacation.followers += 1;
        return;
      }
      stateVacations.push(obj);
    });
    stateVacations.sort((a, b) => { return a.vacationID - b.vacationID });
    this.setState({ vacations: stateVacations });
  }

  private arrangeTicksValueForChart = () => {
    const vacations = [...this.state.vacations];
    const tickValueArr = [...this.state.tickValueArr];
    vacations.map(v => tickValueArr.push(v.vacationID));
    this.setState({ tickValueArr });
  }
  private arrangeTicksFormatForChart = () => {
    const vacations = [...this.state.vacations];
    const tickFormatArr = [...this.state.tickFormatArr]
    vacations.map(v => tickFormatArr.push(`ID : ${v.vacationID}`));
    this.setState({ tickFormatArr });
  }

  public render(): JSX.Element {
    return (
      <div className='chart'>
        {this.state.user.isAdmin ?
        <React.Fragment>
          <h1>Reports Page</h1>
          <VictoryChart
            theme={VictoryTheme.material}
            width={600}
            domainPadding={60}
          >
            <VictoryAxis
              tickValues={this.state.tickValueArr}
              tickFormat={this.state.tickFormatArr}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => (`${x}`)}
            />
            <VictoryBar
              data={this.state.vacations}
              x="vacationID"
              y="followers"
            />
          </VictoryChart>
          </React.Fragment>
        : <PageNotFound />}
      </div>
    );
  }
}