import React, { Component } from 'react';
import '../App.css';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            type: 'student'
        }
    }

    render() {
        return (
            <div className="App loginContainer">
                {/* <img src={logo} className="App-logo" alt="logo" />
                    <p>Edit <code>src/App.js</code> and save to reload.</p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a> */}
                <div className='loginBox'>
                    <div style={{ width: '70vh', height: '70vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column' }}>
                        <p className='login-header'>ลงชื่อเข้าสู่ระบบ</p>
                        {/* <Input className="input" placeholder={'Enter Your UserName'} aria-label="Checkbox for following text input" />
                        <Input className="input" placeholder={'Enter Your Password'} secureTextEntry={true} type="password" name="password" /> */}
                        <Form style={{ flex: 1, alignItems: 'flex-start' }}>
                            <FormGroup style={{ width: '80%', margin: 'auto' }}>
                                <p style={{ textAlign: 'left', marginBottom: -5 }} className="label" for="username" >ชื่อผู้ใช้งาน</p>
                                <Input style={{ fontFamily: 'DBH', fontWeight: "500", fontSize: '25px' }} type="email" name="email" id="username" placeholder="Enter Your Username" />
                            </FormGroup>
                            <FormGroup style={{ width: '80%', margin: 'auto', marginTop: 20 }}>
                                <p style={{ textAlign: 'left', marginBottom: -5 }} className="label" for="Password">รหัสผ่าน</p>
                                <Input style={{ fontFamily: 'DBH', fontWeight: "500", fontSize: '25px' }} name="email" id="Password" placeholder="Enter Your Password" type="password" />
                            </FormGroup>
                            <Form style={{ display: 'flex', flexDirection: 'row', width: '80%', margin: 'auto' }}>
                                <FormGroup onClick={() => this.setState({ type: 'student' })} style={{ width: '120px', marginLeft: '10px', marginTop: 10, display: 'flex', flexDirection: 'row', }}>
                                    <img src={this.state.type === 'student' ? require('../image/radioT.png') : require('../image/radioF.png')} style={{ width: 30, height: 30, marginTop: 14 }} />
                                    <Button onClick={() => this.setState({ type: 'student' })} color="link" style={{ fontFamily: 'DBH', color: '#ff5f6d', fontWeight: 'bolder', fontSize: 30 }}>
                                        {' '}นักเรียน
                                    </Button>
                                </FormGroup>
                                <FormGroup onClick={() => this.setState({ type: 'teacher' })} style={{ width: '120px', marginLeft: '20px', marginTop: 10, display: 'flex', flexDirection: 'row', }}>
                                    <img src={this.state.type === 'teacher' ? require('../image/radioT.png') : require('../image/radioF.png')} style={{ width: 30, height: 30, marginTop: 14 }} />
                                    <Button onClick={() => this.setState({ type: 'teacher' })} color="link" style={{ fontFamily: 'DBH', color: '#ff5f6d', fontWeight: 'bolder', fontSize: 30 }}>
                                        {' '}ผู้สอน
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Form>
                        <Link to="/test">
                            <Button style={{ width: '80%', margin: 'auto', fontFamily: 'DBH', fontSize: 30, backgroundColor: '#f0592b', borderWidth: 0 }} color="secondary" size="lg" active>เข้าสู่ระบบ <FontAwesomeIcon icon="igloo" color={'#fff'} /></Button>
                        </Link>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '80%', margin: 'auto' }}>
                            <Button style={{ color: '#44b29c', fontFamily: 'DBH', fontSize: 30 }} color="link">ลงทะเบียนนักเรียน</Button>
                            <div style={{ height: 30, width: 1, backgroundColor: '#44b27c' }} />
                            <Button style={{ color: '#44b29c', fontFamily: 'DBH', fontSize: 30 }} color="link">ลงทะเบียนผู้สอน</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;