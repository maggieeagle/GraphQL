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
    <Container fluid className="p-0">
      <Row className="m-0">
        {/* Left Sidebar */}
        <Sidepanel></Sidepanel>

        {/* Main Content */}
        <Col md={5} className="h-100">
          <Row>
            <Col md={10}>
              <Pie />
            </Col>
          </Row>
          <Row>
            <Col md={10}>
              <Treemap />
            </Col>
          </Row>
        </Col>
        <Col md={5}>
          <Bar />
        </Col>
      </Row>
    </Container>
  );
}
