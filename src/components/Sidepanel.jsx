import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Sidepanel() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userInfo, setUserInfo] = React.useState({ id: 0, login: '', firstName: '', lastName: '', campus: '', xps: '', auditsDone: '', auditsGot: '' });

    React.useEffect(() => {
        fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: `{
          user {
            id
            login
            firstName
            lastName
            campus
            xps (where: { path: { _regex: "(/johvi/div-01/)(?!(piscine-js))" }}) {
              amount
            }
            audits (where: { grade: { _neq: 0 }} ){
              id
              auditorId
              grade
            }
          }
          audit (where: {grade: {_neq: 0}}) {
            auditorId
          }
        }
        `
            })
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw response;
        }).then(function (data) {
            const userInfo = data.data.user[0]
            const xps = userInfo.xps.reduce((s, n) => s + n.amount, 0);
            setUserInfo({ id: userInfo.id, login: userInfo.login, firstName: userInfo.firstName, lastName: userInfo.lastName, campus: userInfo.campus, xps: xps, auditsDone: userInfo.audits.length, auditsGot: data.data.audit.length - userInfo.audits.length });
        }).catch(function (error) {
            console.warn(error);
            navigate("/login");
            return;
        });
    }, [token]);

    function logout() {
        localStorage.removeItem('token')
        navigate("/login");
        return;
    }

    return (
        <Col md={2} className="p-0 w-100 h-100" style={{ minWidth: "200px" }}>
            <Container className="p-2 w-100" style={{ backgroundColor: "#d6f349", height: "100vh" }}>
                <Stack direction="vertical" gap={2} align="start">
                    <Stack direction="vertical" gap={1}>
                        <div className='p-2'>{userInfo.firstName} {userInfo.lastName}</div>
                        <div className='p-2'>{userInfo.login}</div>
                    </Stack>
                    <hr className="m-0" />
                    <Stack direction="vertical" gap={1}>
                        <div className='p-2'>Campus: {userInfo.campus} </div>
                        <div className='p-2'>XP: {Math.round(userInfo.xps / 1000)} kB</div>
                    </Stack>
                    <hr className="m-0" />
                    <Stack direction="vertical" gap={1}>
                        <div className='p-2'>Audits done: {userInfo.auditsDone} </div>
                        <div className='p-2'>Audits received: {userInfo.auditsGot}</div>
                    </Stack>
                </Stack>
                <div className="p-2" style={{ position: "absolute", bottom: '0' }}>
                    <Button onClick={logout} variant="outline-secondary">Logout</Button>{' '}
                </div>
            </Container>
        </Col>
    );
}