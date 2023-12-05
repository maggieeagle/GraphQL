import * as React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidepanel from './Sidepanel'
import Pie from './graphs/Pie.jsx'
import Treemap from './graphs/Treemap.jsx'
import Bar from './graphs/Bar.jsx'
import { Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {


  console.log(1) //????????????????????

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }


  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="m-0">
        {/* Left Sidebar */}
        <Col md={2} className="p-0">
          <Sidepanel></Sidepanel>
        </Col>

        {/* Main Content */}
        <Col md={10} className="m-0">
          <Row>
            <Col md={6}>
              <Row>
                <Pie />
              </Row>
              <Row>
                <Treemap />
              </Row>
            </Col>


            <Col md={6} className="m-0">
              <Bar />
            </Col>
          </Row>
        </Col>
      </Row >
    </Container >
  );
}
