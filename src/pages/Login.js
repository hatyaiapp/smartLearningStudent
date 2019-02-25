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
                <div className='loginBox'>
                    <div style={styles.loginBox}>
                        <p className='login-header'>ลงชื่อเข้าสู่ระบบ</p>
                        <div style={{ flex: 1, alignItems: 'flex-start' }}>
                            <FormGroup style={{ width: '60vw', margin: 'auto' }}>
                                <p style={{ textAlign: 'left', marginBottom: -5, fontSize: '2vw' }} className="label">ชื่อผู้ใช้งาน</p>
                                <Input style={{ fontFamily: 'DBH', fontWeight: "500", fontSize: '2vw' }} type="email" name="email" id="username" placeholder="Enter Your Username" />
                            </FormGroup>
                            <FormGroup style={{ width: '60vw', margin: 'auto', marginTop: 20 }}>
                                <p style={{ textAlign: 'left', marginBottom: -5, fontSize: '2vw' }} className="label">รหัสผ่าน</p>
                                <Input style={{ fontFamily: 'DBH', fontWeight: "500", fontSize: '2vw' }} name="email" id="Password" placeholder="Enter Your Password" type="password" />
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
                        <Link to="/test">
                            <Button style={{ width: '60vw', margin: 'auto', fontFamily: 'DBH', fontSize: '2.5vw', backgroundColor: '#f0592b', borderWidth: 0 }} color="secondary" size="lg" active>เข้าสู่ระบบ</Button>
                        </Link>
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