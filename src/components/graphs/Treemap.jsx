

import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

export default class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [
                {
                    data: [
                        {
                            x: 'New Delhi',
                            y: 218
                        },
                        {
                            x: 'Kolkata',
                            y: 149
                        },
                        {
                            x: 'Mumbai',
                            y: 184
                        },
                        {
                            x: 'Ahmedabad',
                            y: 55
                        },
                        {
                            x: 'Bangaluru',
                            y: 84
                        },
                        {
                            x: 'Pune',
                            y: 31
                        },
                        {
                            x: 'Chennai',
                            y: 70
                        },
                        {
                            x: 'Jaipur',
                            y: 30
                        },
                        {
                            x: 'Surat',
                            y: 44
                        },
                        {
                            x: 'Hyderabad',
                            y: 68
                        },
                        {
                            x: 'Lucknow',
                            y: 28
                        },
                        {
                            x: 'Indore',
                            y: 19
                        },
                        {
                            x: 'Kanpur',
                            y: 29
                        }
                    ]
                }
            ],
            options: {
                legend: {
                    show: false
                },
                chart: {
                    height: 350,
                    type: 'treemap'
                },
                title: {
                    text: 'People in team per task'
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
                group (where: { members: { userId: {_eq: ${userId} }}}){
                  path
                  members {
                    userLogin
                    userId
                  }
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
                const groupsInfo = data.data.group;
                console.log(groupsInfo)
                const pairsPathAndNumberOfMembers = groupsInfo.map((group) => ({
                    x: group.path.match(/(?<=\/)[^\/]*$/g),
                    y: group.members.length,
                  }));
                  this.setState({
                    series: [{
                      ...this.state.series[0],
                      data: pairsPathAndNumberOfMembers,
                    }],
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
            <div id="chart" className="mt-4">
                <ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />
            </div>
        );
    }
}