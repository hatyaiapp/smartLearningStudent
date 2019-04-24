import React, { Component } from 'react';
import '../../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Spinner, Fade, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectSearch from 'react-select-search'

let showErr;

class CodeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

let word = {
    th: {
        signUp: 'สมัครสมาชิก',
        email: 'อีเมล',
        studentId: 'รหัสนักเรียน/นักศึกษา',
        password: 'รหัสผ่าน',
        activateCode: 'Activate Code',
        login: 'เข้าสู่ระบบ',
        alreadyHaveCode: 'มีรหัสลงทะเบียนแล้ว',
        activated: 'ลงทะเบียน',
        name: 'ชื่อ นามสกุล',
        inviteCode: 'Invite Code',
        password: 'รหัสผ่าน',
        dontHaveCode: 'ยังไม่มีรหัสลงทะเบียน',
        registerComplete: 'สมัครสมาชิกสำเร็จ',
        checkEmailGetCode: 'กรุณาตรวจสอบ Email เพื่อรับ "Activate Code"',
        activatedComplete: 'ลงทะเบียนสำเร็จ',
        ok: 'ตกลง',
        err_accountNotActivated: 'ยังไม่ได้ยืนยันการสมัครสมาชิกผ่านอีเมล',
        err_duplicateEmail: 'อีเมลนี้ถูกใช้งานแล้ว',
        err_requireInviteCode: 'กรุณากรอกข้อมูล Invite Code',
        err_invalidInviteCode: 'Invite Code ไม่ถูกต้อง',
        err_invalidActivatedCode: 'Activated Code ไม่ถูกต้อง หรือ หมดอายุ กรุณาตรวจสอบ อีเมล',
    },
    en: {
        signUp: 'Sign Up',
        email: 'E-mail Address',
        studentId: 'Student ID',
        password: 'Password',
        activateCode: 'Activate Code',
        login: 'Sign in',
        alreadyHaveCode: 'already have activated code',
        activated: 'Activate Account',
        name: 'Name Surname',
        inviteCode: 'Invite Code',
        password: 'Password',
        dontHaveCode: "do not have activated code",
        registerComplete: 'Register Complete',
        checkEmailGetCode: 'Please check your email to activate account',
        activatedComplete: 'Activated account complate',
        ok: 'OK',
        err_accountNotActivated: 'Account not activated',
        err_duplicateEmail: 'Duplicate email',
        err_requireInviteCode: 'Require invite code',
        err_invalidInviteCode: 'Invalid invite code',
        err_invalidActivatedCode: 'Invalid activated code or expired check your email',
    }
}

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            type: 'student',
            username: 'natruja@jkt.com',
            password: '',
            isLoading: false,
            backToLogin: false,
            email: '',
            registerState: 1,
            activatecode: '',
            inviteCode: '',
            name: '',
            password: '',
            registerComplete: false
        }
    }

    componentDidMount() {
        this.setState({ inviteCode: this.props.ac || '', registerState: /*this.props.ac ? 2 :*/ 1 })
    }

    SendEmail() {
        //"6XXACBQ4MB"
        console.log(this.state.email)
        fetch('http://student.questionquick.com/user/signup/', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                'number': this.state.email,
                'inviteCode': this.state.inviteCode,
                'name': this.state.name,
                'password': this.state.password,
            })
        })
            .then(res => Promise.all([res, res.json()]))
            .then(resp => {
                let response = resp[0]
                let e = resp[1]
                if (!response.ok) {
                    throw new CodeError(e.message, e.code);
                }
                else {
                    this.setState({ registerComplete: true })
                }
            })
            .catch(err => {
                this.setState({ isLoading: false }, () => this.loginFailed(err.message))
            })
    }

    loginFailed(err) {
        let msg = ''
        switch (err) {
            case 'Account not activated': msg = word[window.language].err_accountNotActivated; break;
            case 'Duplicate email': msg = word[window.language].err_duplicateEmail; break;
            case 'require invite Code': msg = word[window.language].err_requireInviteCode; break;
            case 'Invalid invite Code': msg = word[window.language].err_invalidInviteCode; break;
            case 'Invalid activated code or expired check your email': msg = word[window.language].err_invalidActivatedCode; break;
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

    register() {
        console.log(
            this.state.activatecode,
            this.state.invitecode,
            this.state.name,
            this.state.password
        )
        fetch('http://student.questionquick.com/user/activate/', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                'activateCode': this.state.activatecode,
                'inviteCode': this.state.invitecode,
                'name': this.state.name,
                'password': this.state.password,
            })
        })
            .then(res => Promise.all([res, res.json()]))
            .then(resp => {
                console.log("emailLoginRes", resp)
                let response = resp[0]
                let e = resp[1]
                if (!response.ok) {
                    throw new CodeError(e.message, e.code);
                }
                else {
                    console.log('done')
                    this.setState({ activateComplete: true })
                }
            })
            .catch(err => {
                this.setState({ isLoading: false }, () => this.loginFailed(err.message))
            })
    }

    changeLang(lang) {
        window.language = lang
        window.localStorage.setItem('language', lang)
        this.forceUpdate()
    }

    render() {
        if (this.state.backToLogin) {
            return <Redirect to="/" />
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
                        {this.state.registerState === 1 && <p className='login-header'>{word[window.language].signUp}</p>}
                        {this.state.registerState === 2 && <p className='login-header'>{word[window.language].activated}</p>}
                        {this.state.registerState === 1 &&
                            <div style={styles.loginContainer}>
                                <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].studentId}</p>
                                    <Input
                                        value={this.state.studentId}
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                        style={styles.input}
                                        type="text" name="number" id="number" placeholder="Student ID"
                                    />
                                </FormGroup>
                                {/* <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].email}</p>
                                    <SelectSearch style={styles.input} options={options} value="sv" name="language" placeholder="Choose your language" />
                                </FormGroup> */}
                                <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].password}</p>
                                    <Input
                                        value={this.state.password}
                                        onChange={(e) => this.setState({ password: e.target.value })}
                                        style={styles.input}
                                        type="password" name="password" id="password" placeholder="Password"
                                    />
                                </FormGroup>
                                <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].name}</p>
                                    <Input
                                        value={this.state.name}
                                        onChange={(e) => this.setState({ name: e.target.value })}
                                        style={styles.input}
                                        type="text" name="name" id="name" placeholder="Name"
                                    />
                                </FormGroup>
                                <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].inviteCode}</p>
                                    <Input
                                        value={this.state.inviteCode}
                                        onChange={(e) => this.setState({ inviteCode: e.target.value })}
                                        style={styles.input}
                                        type="text" name="activateCode" id="activateCode" placeholder="Invite code"
                                    />
                                </FormGroup>
                            </div>
                        }

                        {/* {this.state.registerState === 2 &&
                            <div style={styles.loginContainer}>
                                <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">Activate Code</p>
                                    <Input
                                        value={this.state.activatecode}
                                        onChange={(e) => this.setState({ activatecode: e.target.value })}
                                        style={styles.input}
                                        type="text" name="activatecode" id="activatecode" placeholder="activate code"
                                    />
                                </FormGroup>
                                <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                    <p style={styles.inputLabel} className="label">Invite Code</p>
                                    <Input
                                        value={this.state.invitecode}
                                        onChange={(e) => this.setState({ invitecode: e.target.value })}
                                        style={styles.input}
                                        type="text" name="invitecode" id="invitecode" placeholder="invite code"
                                    />
                                </FormGroup>
                                <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].name}</p>
                                    <Input
                                        value={this.state.name}
                                        onChange={(e) => this.setState({ name: e.target.value })}
                                        style={styles.input}
                                        type="text" name="username" id="username" placeholder={word[window.language].name}
                                    />
                                </FormGroup>
                                <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                    <p style={styles.inputLabel} className="label">{word[window.language].password}</p>
                                    <Input
                                        value={this.state.password}
                                        onChange={(e) => this.setState({ password: e.target.value })}
                                        style={styles.input}
                                        type="password" name="password" id="password" placeholder={word[window.language].password}
                                    />
                                </FormGroup>
                            </div>
                        } */}

                        <Fade in={this.state.isShowErr} style={styles.errAlert} tag="h5" className="mt-3">
                            <span style={styles.errorTxt}>{this.state.failedMsg}</span>
                        </Fade>
                        {this.state.registerState === 1 && <Button onClick={() => this.SendEmail()} style={styles.finishBtn}>
                            {word[window.language].signUp}
                            <FontAwesomeIcon icon={faCaretRight} style={styles.finishBtnIco} />
                        </Button>
                        }
                        {this.state.registerState === 2 && <Button onClick={() => this.register()} style={styles.finishBtn}>
                            {word[window.language].activated}
                            <FontAwesomeIcon icon={faCaretRight} style={styles.finishBtnIco} />
                        </Button>
                        }

                        <div style={styles.registerContainer}>
                            <Button style={styles.registerBtn} onClick={() => this.setState({ backToLogin: true })} color="link">{word[window.language].login}</Button>
                            {/* {this.state.registerState === 1 && <Button style={{ ...styles.registerBtn, color: '#bb4d63' }} onClick={() => this.setState({ registerState: 2 })} color="link">{word[window.language].alreadyHaveCode}</Button>} */}
                            {this.state.registerState === 2 && <Button style={{ ...styles.registerBtn, color: '#bb4d63' }} onClick={() => this.setState({ registerState: 1 })} color="link">{word[window.language].dontHaveCode}</Button>}
                        </div>
                    </div>
                </div>

                <div style={styles.langBox}>
                    <Button onClick={() => this.changeLang('th')} color="link"><p style={{ ...styles.langBtn, color: window.language === 'th' ? '#e71c63' : '#aaa' }}>ไทย</p></Button>
                    <p style={styles.langBtn}>/</p>
                    <Button onClick={() => this.changeLang('en')} color="link"><p style={{ ...styles.langBtn, color: window.language === 'en' ? '#e71c63' : '#aaa' }}>EN</p></Button>
                </div>

                <Modal isOpen={this.state.registerComplete}>
                    <ModalBody>
                        <p style={styles.ModalHeader}>{word[window.language].registerComplete}</p>
                        <span style={styles.text}>{word[window.language].activatedComplete}</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={styles.ModalBtnTxt} color="success" onClick={() => this.setState({ /*registerState: 2,*/ registerComplete: false }, () => this.setState({ backToLogin: true }))}>{word[window.language].ok}</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.activateComplete}>
                    <ModalBody>
                        <span style={styles.ModalHeader}>{word[window.language].activatedComplete}</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={styles.ModalBtnTxt} color="success" onClick={() => this.setState({ backToLogin: true })}>{word[window.language].ok}</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

let styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    loading: { width: '3rem', height: '3rem' },
    loginBox: { width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' },
    loginContainer: { display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' },
    text: { fontFamily: 'DBH', fontSize: '24px' },
    inputBox: { width: '60vw' },
    inputLabel: { textAlign: 'left', marginBottom: -5, fontSize: '30px' },
    input: { fontFamily: 'DBH', fontWeight: "500", fontSize: '30px' },
    dropdownInput: { width: '100%', },
    finishBtn: { width: '60vw', margin: 'auto', fontFamily: 'DBH', fontSize: '30px', backgroundColor: '#f0592b', borderWidth: 0 },
    finishBtnIco: { width: '1.75vw', fontSize: '24px', color: '#fff' },
    registerContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '60vw', margin: 'auto' },
    registerBtn: { color: '#44b29c', fontFamily: 'DBH', fontSize: '30px' },
    errorTxt: { textAlign: 'left', color: 'red', fontFamily: 'DBH', fontSize: '24px' },
    errAlert: { width: '60vw', marginTop: '10px', margin: 'auto' },
    ModalHeader: { color: '#1c5379', fontFamily: 'DBH', fontSize: '24px', fontWeight: '500' },
    ModalBtnTxt: { color: '#fff', fontFamily: 'DBH', fontSize: '24px', fontWeight: '500' },
    langBox: { color: '#aaa', display: 'flex', flexDirection: 'row', top: 0, right: 0, alignItems: 'center', alignSelf: 'flex-start', position: 'absolute' },
    langBtn: { fontFamily: 'DBH', fontSize: '30px' }
}