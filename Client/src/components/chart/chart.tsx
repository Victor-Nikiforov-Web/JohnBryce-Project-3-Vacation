import React, { Component } from 'react';
import './chart.css';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';


const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

export class Chart extends Component {

  public constructor(props: any) {
    super(props);
    this.state = {
      vacations: {
        vacationName: null,
        followers : null
      }
    }
  }

  public componentDidMount = () => {
    const options = {
      method: "GET",
      headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
      }
  };

  fetch('http://localhost:3000/api/vacations/all-followed-vacations', options)
      .then(res => res.json())
      .then(vacations => {
        console.log(vacations)
      })
      .catch(err => alert(err));
  }

  public render(): JSX.Element {
    return (
      <div className='chart'>
        <VictoryChart
          domainPadding={20}
        >
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={[1, 2, 3, 4]}
            tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
          />
          <VictoryAxis
            dependentAxis
            // tickFormat specifies how ticks should be displayed
            tickFormat={(x) => (`${x / 1}`)}
          />
          <VictoryBar
            data={data}
            x="quarter"
            y="earnings"
          />
        </VictoryChart>
      </div>
    );
  }
}