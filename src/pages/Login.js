import React, { Component } from 'react';
import '../App.css';
import { Button, Form, FormGroup, Input, Spinner } from 'reactstrap';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText, ClickOutside } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            type: 'student',
            username: 'natruja@jkt.com',
            password: '',
            isLoading: false,
            redirect: false
        }
    }

    componentDidMount() {
        fetch('http://student.questionquick.com/session/', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(e => {
                if (e.code == '401') {
                    throw { message: e.message }
                }
                else if (e.uid) {
                    this.setState({ isLoading: false }, () => this.setState({ redirect: true }))
                    console.log(e)
                }
                else {
                    this.setState({ isLoading: false })
                }

            })
            .catch(err => {
                this.setState({ isLoading: false })
                console.log('error', err)
            })
    }

    Login() {
        console.log("username", this.state.username)
        console.log("password", this.state.password)
        this.setState({ isLoading: true }, () => {
            fetch('http://student.questionquick.com/session/',
                {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({ 'username': this.state.username })
                })
                .then(res => res.json())
                .then(e => {
                    if (e.code == '401') {
                        throw { message: e.message }
                    }
                    else {
                        this.setState({ isLoading: false, redirect: true })
                        console.log(e)
                    }

                })
                .catch(err => {
                    this.setState({ isLoading: false }, () => alert(err.message))

                })
        })

    }

    render() {
        if (this.state.redirect) {
            return <Redirect แ to="/Test" />;
        }

        return (
            <div className="App loginContainer">
                {this.state.isLoading ?
                    <div style={{ display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Spinner type="grow" color="warning" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    :
                    null
                }
                <div className='loginBox'>
                    <div style={styles.loginBox}>
                        <p className='login-header'>ลงชื่อเข้าสู่ระบบ</p>
                        <div style={{ flex: 1, alignItems: 'flex-start' }}>
                            <FormGroup style={{ width: '60vw', margin: 'auto' }}>
                                <p style={{ textAlign: 'left', marginBottom: -5, fontSize: '2vw' }} className="label">ชื่อผู้ใช้งาน</p>
                                <Input
                                    value={this.state.username}
                                    onChange={(e) => this.setState({ username: e.target.value })}
                                    style={{ fontFamily: 'DBH', fontWeight: "500", fontSize: '2vw' }}
                                    type="email" name="email" id="username" placeholder="Enter Your Username"
                                />
                            </FormGroup>
                            <FormGroup style={{ width: '60vw', margin: 'auto', marginTop: 20 }}>
                                <p style={{ textAlign: 'left', marginBottom: -5, fontSize: '2vw' }} className="label">รหัสผ่าน</p>
                                <Input
                                    value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    style={{ fontFamily: 'DBH', fontWeight: "500", fontSize: '2vw' }}
                                    name="email" id="Password" placeholder="Enter Your Password" type="password"
                                />
                            </FormGroup>
                            <Form style={{ display: 'flex', flexDirection: 'row', width: '60vw', margin: 'auto' }}>
                                <FormGroup onClick={() => this.setState({ type: 'student' })} style={{ width: '12vw', marginLeft: '1vw', marginTop: 10, display: 'flex', flexDirection: 'row', }}>
                                    <img src={this.state.type === 'student' ? require('../image/radioT.png') : require('../image/radioF.png')} style={{ width: '2vw', height: '2vw', marginTop: '1vw' }} alt={'นักเรียน'} />
                                    <Button onClick={() => this.setState({ type: 'student' })} color="link" style={{ fontFamily: 'DBH', color: '#ff5f6d', fontWeight: 'bolder', fontSize: '2vw' }}>
                                        {' '}นักเรียน
                                    </Button>
                                </FormGroup>
                                <FormGroup onClick={() => this.setState({ type: 'teacher' })} style={{ width: '12vw', marginLeft: '1vw', marginTop: 10, display: 'flex', flexDirection: 'row', }}>
                                    <img src={this.state.type === 'teacher' ? require('../image/radioT.png') : require('../image/radioF.png')} style={{ width: '2vw', height: '2vw', marginTop: '1vw' }} alt={'ผู้สอน'} />
                                    <Button onClick={() => this.setState({ type: 'teacher' })} color="link" style={{ fontFamily: 'DBH', color: '#ff5f6d', fontWeight: 'bolder', fontSize: '2vw' }}>
                                        {' '}ผู้สอน
                                    </Button>
                                </FormGroup>
                            </Form>
                        </div>
                        {/* <Link to="/test"> */}
                        <Button onClick={() => this.Login()} style={{ width: '60vw', margin: 'auto', fontFamily: 'DBH', fontSize: '2.5vw', backgroundColor: '#f0592b', borderWidth: 0 }} color="secondary" size="lg" active>เข้าสู่ระบบ</Button>
                        {/* </Link> */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '60vw', margin: 'auto' }}>
                            <Button style={{ color: '#44b29c', fontFamily: 'DBH', fontSize: '2.5vw' }} color="link">ลงทะเบียนนักเรียน</Button>
                            <div style={{ height: '2vw', width: 1, backgroundColor: '#44b27c' }} />
                            <Button style={{ color: '#44b29c', fontFamily: 'DBH', fontSize: '2.5vw' }} color="link">ลงทะเบียนผู้สอน</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
    loginBox: { width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column' }
}

export default Login;