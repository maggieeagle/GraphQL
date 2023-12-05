
import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

export default class Pie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        labels: [],
        chart: {
          type: 'donut',
        },
        title: {
          text: 'Days per task'
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'top',
              },
            },
          },
        ],
      },
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `{
          user {
            progresses (where: {path: {_regex: "(/johvi/div-01/)(?!(piscine-js))"}, isDone: {_eq: true}}){
              path
              createdAt
              updatedAt
            }
          }
        }`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        const userInfo = data.data.user[0].progresses;
        console.log(userInfo)
        const series = userInfo.map((progress) => {
          const createdAt = new Date(progress.createdAt).getTime();
          const endAt = new Date(progress.updatedAt).getTime();
          const duration = endAt - createdAt;
          return Math.round(duration / 1000 / 3600 / 24)
        });
        const labels = userInfo.map((progress) => progress.path.match(/(?<=\/)[^\/]*$/g));
        console.log(series)
        this.setState({ series });
        this.setState({
          series,
          options: {
            ...this.state.options,
            labels,
          },
        });
      })
      .catch((error) => {
        console.warn(error);
        // Handle error, e.g., navigate to login page
        // navigate("/login");
      });
  }

  render() {
    return (
      <div id="chart" className="mt-3">
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
      </div>
    );
  }
}