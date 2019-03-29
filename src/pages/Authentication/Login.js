import React, { Component } from 'react';
import '../../App.css';
import { Button, Form, FormGroup, Input, Spinner, Alert, Fade } from 'reactstrap';
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let showErr;

class CodeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

class Login extends Component {
    constructor() {
        super();
        this.state = {
            type: 'student',
            username: 'natruja@jkt.com',
            password: '',
            isLoading: false,
            redirect: false,
            registerPage: false,
            isShowErr: false,
            failedMsg: '',
        }
    }

    componentDidMount() {
        window.sideNav = false
        fetch('http://student.questionquick.com/session/', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(e => {
                if (e.code === '401') {
                    throw new CodeError(e.message, e.code);
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
                    console.log('login e', e)
                    if (e.code === 401) {
                        throw new CodeError(e.message, e.code);
                    }
                    else {
                        this.setState({ isLoading: false, redirect: true })
                        console.log(e)
                    }

                })
                .catch(err => {
                    this.setState({ isLoading: false }, () => this.loginFailed(err.message))

                })
        })
    }

    loginFailed(err) {
        let msg = ''
        switch (err) {
            case 'Invalid password': msg = 'อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง'; break;
            case 'Account not activated': msg = 'ยังไม่ได้ยืนยันการสมัครสมาชิกผ่านอีเมล'; break;
            default: msg = err
        }
        clearTimeout(showErr);
        this.setState({ failedMsg: msg, isShowErr: true }, () => {
            let _this = this
            showErr = setTimeout(function () {
                _this.setState({ isShowErr: false })
            }, 10000);
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/test" />;
        }

        if (this.state.registerPage) {
            return <Redirect to="/register" />;
        }

        return (
            <div className="App loginContainer">
                {this.state.isLoading ?
                    <div style={styles.loadingContainer}>
                        <Spinner type="grow" color="warning" style={styles.loading} />
                    </div>
                    :
                    null
                }
                <div className='loginBox'>
                    <div style={styles.loginBox}>
                        <p className='login-header'>ลงชื่อเข้าสู่ระบบ</p>
                        <div style={styles.loginContainer}>
                            <FormGroup style={styles.inputBox}>
                                <p style={styles.inputLabel} className="label">ชื่อผู้ใช้งาน</p>
                                <Input
                                    value={this.state.username}
                                    onChange={(e) => this.setState({ username: e.target.value })}
                                    style={styles.input}
                                    type="email" name="email" id="username" placeholder="Enter Your Username"
                                />
                            </FormGroup>
                            <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                <p style={styles.inputLabel} className="label">รหัสผ่าน</p>
                                <Input
                                    value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    style={styles.input}
                                    name="email" id="Password" placeholder="Enter Your Password" type="password"
                                />
                            </FormGroup>
                            <Form style={styles.userTypeContainer}>
                                {/* <FormGroup onClick={() => this.setState({ type: 'student' })} style={styles.userTypeBox}>
                                    <img src={this.state.type === 'student' ? require('../../image/radioT.png') : require('../../image/radioF.png')} style={styles.radioBtn} alt={'นักเรียน'} />
                                    <Button onClick={() => this.setState({ type: 'student' })} color="link" style={styles.userTypeTxt}>
                                        {' '}นักเรียน
                                    </Button>
                                </FormGroup> */}
                                {/* <FormGroup onClick={() => this.setState({ type: 'teacher' })} style={styles.userTypeBox}>
                                    <img src={this.state.type === 'teacher' ? require('../../image/radioT.png') : require('../../image/radioF.png')} style={styles.radioBtn} alt={'ผู้สอน'} />
                                    <Button onClick={() => this.setState({ type: 'teacher' })} color="link" style={styles.userTypeTxt}>
                                        {' '}ผู้สอน
                                    </Button>
                                </FormGroup> */}
                            </Form>
                        </div>
                        <Fade in={this.state.isShowErr} style={styles.errAlert} tag="h5" className="mt-3">
                            <span style={styles.errorTxt}>{this.state.failedMsg}</span>
                        </Fade>
                        <Button onClick={() => this.Login()} style={styles.loginBtn}>
                            เข้าสู่ระบบ
                            <FontAwesomeIcon icon={faCaretRight} style={styles.loginBtnIco} />
                        </Button>
                        <div style={styles.registerContainer}>
                            <Button style={styles.registerBtn} onClick={() => this.setState({ registerPage: true })} color="link">ลงทะเบียนนักเรียน</Button>
                            {/* <div style={styles.registerLine} />
                            <Button style={styles.registerBtn} color="link">ลงทะเบียนผู้สอน</Button> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    loading: { width: '3rem', height: '3rem' },
    loginBox: { width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' },
    loginContainer: { flex: 1, alignItems: 'flex-start' },
    inputBox: { width: '60vw', margin: 'auto' },
    inputLabel: { textAlign: 'left', marginBottom: -5, fontSize: '2vw' },
    input: { fontFamily: 'DBH', fontWeight: "500", fontSize: '2vw' },
    userTypeContainer: { display: 'flex', flexDirection: 'row', width: '60vw', margin: 'auto' },
    userTypeBox: { width: '12vw', marginLeft: '1vw', marginTop: 10, display: 'flex', flexDirection: 'row' },
    radioBtn: { width: '2vw', height: '2vw', marginTop: '1vw' },
    userTypeTxt: { fontFamily: 'DBH', color: '#ff5f6d', fontWeight: 'bolder', fontSize: '2vw' },
    loginBtn: { width: '60vw', margin: 'auto', fontFamily: 'DBH', fontSize: '2.5vw', backgroundColor: '#f0592b', borderWidth: 0 },
    loginBtnIco: { width: '1.75vw', fontSize: '1.5vw', color: '#fff' },
    registerContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '60vw', margin: 'auto' },
    registerBtn: { color: '#44b29c', fontFamily: 'DBH', fontSize: '2.5vw' },
    registerLine: { height: '2vw', width: 1, backgroundColor: '#44b27c' },
    errorTxt: { textAlign: 'left', color: 'red', fontFamily: 'DBH', fontSize: '2rem' },
    errAlert: { width: '60vw', marginTop: '10px', margin: 'auto' },
}

export default Login;