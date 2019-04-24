import React, { Component } from 'react';
import '../../App.css';
import { Button, Form, FormGroup, Input, Spinner, Alert, Fade } from 'reactstrap';
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectSearch from 'react-select-search'

let showErr;

let word = {
    th: {
        signIn: 'ลงชื่อเข้าสู่ระบบ',
        username: 'ชื่อผู้ใช้งาน',
        password: 'รหัสผ่าน',
        enterYourEmail: 'อีเมล',
        enterYourPassword: 'รหัสผ่าน',
        login: 'เข้าสู่ระบบ',
        signUpStudent: 'ลงทะเบียนนักเรียน',
        err_wrongAuth: 'อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง',
        err_notActivate: 'ยังไม่ได้ยืนยันการสมัครสมาชิกผ่านอีเมล (กรุณาตรวจสอบอีเมลที่ใช้สมัครสมาชิก)',
    },
    en: {
        signIn: 'Sign In',
        username: 'Username',
        password: 'Password',
        enterYourEmail: 'Enter your e-mail',
        enterYourPassword: 'Enter your password',
        login: 'Sign In',
        signUpStudent: 'Sign Up',
        err_wrongAuth: 'Invalid Email or Password',
        err_notActivate: 'Have not activated account. (Please check E-mail)',
    }
}

const options = [
    { name: 'Swedish', value: 'sv' },
    { name: 'English', value: 'en' },
];

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
            username: '',
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
        console.log(err)
        switch (err) {
            case 'Invalid username or password': msg = word[window.language].err_wrongAuth; break;
            case 'Account not activated': msg = word[window.language].err_notActivate; break;
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

    changeLang(lang) {
        window.language = lang
        window.localStorage.setItem('language', lang)
        this.forceUpdate()
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
                        <p className='login-header'>{word[window.language].signIn}</p>
                        <div style={styles.loginContainer}>
                            <FormGroup style={styles.inputBox}>
                                <p style={styles.inputLabel} className="label">{word[window.language].username}</p>
                                <Input
                                    value={this.state.username}
                                    onChange={(e) => this.setState({ username: e.target.value })}
                                    style={styles.input}
                                    type="email" name="email" id="username" placeholder="Enter Your Username"
                                />
                            </FormGroup>
                            <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                <p style={styles.inputLabel} className="label">{word[window.language].password}</p>
                                <Input
                                    value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    style={styles.input}
                                    name="email" id="Password" placeholder="Enter Your Password" type="password"
                                />
                            </FormGroup>
                            <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                <p style={styles.inputLabel} className="label">{word[window.language].password}</p>
                                <SelectSearch
                                    options={options}
                                    value="sv"
                                    mode="input"
                                    name="language"
                                    placeholder="Choose your language"
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
                            {word[window.language].login}
                            <FontAwesomeIcon icon={faCaretRight} style={styles.loginBtnIco} />
                        </Button>
                        <div style={styles.registerContainer}>
                            <Button style={styles.registerBtn} onClick={() => this.setState({ registerPage: true })} color="link">{word[window.language].signUpStudent}</Button>
                            {/* <div style={styles.registerLine} />
                            <Button style={styles.registerBtn} color="link">ลงทะเบียนผู้สอน</Button> */}
                        </div>
                    </div>
                    <div style={styles.langBox}>
                        <Button onClick={() => this.changeLang('th')} color="link"><p style={{ ...styles.langBtn, color: window.language === 'th' ? '#e71c63' : '#aaa' }}>ไทย</p></Button>
                        <p style={styles.langBtn}>/</p>
                        <Button onClick={() => this.changeLang('en')} color="link"><p style={{ ...styles.langBtn, color: window.language === 'en' ? '#e71c63' : '#aaa' }}>EN</p></Button>
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    loading: { width: '3rem', height: '3rem' },
    loginBox: { width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' },
    loginContainer: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' },
    inputBox: { width: '60vw' },
    inputLabel: { textAlign: 'left', marginBottom: -5, fontSize: '30px' },
    input: { fontFamily: 'DBH', fontWeight: "500", fontSize: '30px' },
    userTypeContainer: { display: 'flex', flexDirection: 'row', width: '60vw', margin: 'auto' },
    userTypeBox: { width: '12vw', marginLeft: '1vw', marginTop: 10, display: 'flex', flexDirection: 'row' },
    radioBtn: { width: '2vw', height: '2vw', marginTop: '1vw' },
    userTypeTxt: { fontFamily: 'DBH', color: '#ff5f6d', fontWeight: 'bolder', fontSize: '24px' },
    loginBtn: { width: '60vw', margin: 'auto', fontFamily: 'DBH', fontSize: '30px', backgroundColor: '#f0592b', borderWidth: 0 },
    loginBtnIco: { width: '1.75vw', fontSize: '24px', color: '#fff' },
    registerContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '60vw', margin: 'auto' },
    registerBtn: { color: '#44b29c', fontFamily: 'DBH', fontSize: '30px' },
    registerLine: { height: '2vw', width: 1, backgroundColor: '#44b27c' },
    errorTxt: { textAlign: 'left', color: 'red', fontFamily: 'DBH', fontSize: '24px' },
    errAlert: { width: '60vw', marginTop: '10px', margin: 'auto' },
    langBox: { color: '#aaa', display: 'flex', flexDirection: 'row', top: 0, right: 0, alignItems: 'center', alignSelf: 'flex-start', position: 'absolute' },
    langBtn: { fontFamily: 'DBH', fontSize: '30px' }
}

export default Login;