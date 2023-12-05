
import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [{
        data: []
      }],
      options: {
        chart: {
          type: 'bar',
          width: 'auto',
        },
        title: {
          text: 'Audits per auditor (top 20)'
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            borderRadiusApplication: 'end',
            barHeight: '70%',
            horizontal: true,
          }
        },
        tooltip: {
          enabled: true,
          shared: true,
          followCursor: true,
          intersect: false,
          y: {
            formatter: function (val) {
              return Math.round(val);
            }
          }
        }
      },

    };
  }

  getIdFromJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).sub;
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const userId = this.getIdFromJwt(token);
    fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `{
          audit(where: { auditorId: { _neq: ${userId} }}) {
            auditorLogin
            auditorId
          }
        }
        `,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        const info = data.data.audit;

        // Create an object to store audits count by login
        const auditsByLogin = {};
        info.forEach(audit => {
          const { auditorLogin, auditorId } = audit;
        
          // Increment the count for the current login
          auditsByLogin[auditorLogin] = (auditsByLogin[auditorLogin] || 0) + 1;
        });
        
        // Convert the object into an array of { login, audits } objects
        const arrayOfObjects = Object.entries(auditsByLogin).map(([login, audits]) => ({ login, audits }));
        
        // Sort the array of objects by audits in descending order
        arrayOfObjects.sort((a, b) => b.audits - a.audits);
        
        // Get the first 20 audits and logins
        const top20Audits = arrayOfObjects.slice(0, 20).map(item => item.audits);
        const top20Logins = arrayOfObjects.slice(0, 20).map(item => item.login);
       
        this.setState({
          series: [{ data: top20Audits }],
          options: {
            ...this.state.options,
            xaxis: {
              categories: top20Logins,
            }
          }
        })
      })
      .catch((error) => {
        console.warn(error);
        // Handle error, e.g., navigate to login page
        // navigate("/login");
      });
  }



  render() {
    return (
      <div id="chart" className="pt-3" style={{ height: '100vh' }}>
        <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={'100%'} />
      </div>

    );
  }
}