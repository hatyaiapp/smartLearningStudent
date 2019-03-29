import React, { Component } from 'react';
import '../../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Spinner, Fade } from 'reactstrap';
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
            invitecode: '',
            name: '',
            password: '',
            registerComplete: false
        }
    }

    componentDidMount() {
        this.setState({ activatecode: this.props.ac })
    }

    SendEmail() {
        //"6XXACBQ4MB"
        console.log(this.state.email)
        fetch('http://student.questionquick.com/user/signup/', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ 'email': this.state.email })
        })
            .then(res => res.json())
            .then(e => {
                console.log("emailLoginRes", e)
                if (e.code === 400 || e.code === 401) {
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
            case 'Invalid password': msg = 'อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง'; break;
            case 'Account not activated': msg = 'ยังไม่ได้ยืนยันการสมัครสมาชิกผ่านอีเมล'; break;
            case 'Duplicate email': msg = 'อีเมลนี้ถูกใช้งานแล้ว'; break;
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
            .then(res => res.json())
            .then(e => {
                console.log("emailLoginRes", e)
                if (e.code === 400 || e.code === 401) {
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
                        {this.state.registerState === 1 && <p className='login-header'>สมัครสมาชิก</p>}
                        {this.state.registerState === 2 && <p className='login-header'>ลงทะเบียน</p>}
                        {this.state.registerState === 1 &&
                            <div style={styles.loginContainer}>
                                <FormGroup style={styles.inputBox}>
                                    <p style={styles.inputLabel} className="label">Email Address</p>
                                    <Input
                                        value={this.state.email}
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                        style={styles.input}
                                        type="email" name="email" id="username" placeholder="Email"
                                    />
                                </FormGroup>
                            </div>
                        }

                        {this.state.registerState === 2 &&
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
                                    <p style={styles.inputLabel} className="label">ชื่อ - สกุล</p>
                                    <Input
                                        value={this.state.name}
                                        onChange={(e) => this.setState({ name: e.target.value })}
                                        style={styles.input}
                                        type="text" name="username" id="username" placeholder="ชื่อ สกุล"
                                    />
                                </FormGroup>
                                <FormGroup style={{ ...styles.inputBox, marginTop: 20 }}>
                                    <p style={styles.inputLabel} className="label">รหัสผ่าน</p>
                                    <Input
                                        value={this.state.password}
                                        onChange={(e) => this.setState({ password: e.target.value })}
                                        style={styles.input}
                                        type="password" name="password" id="password" placeholder="รหัสผ่าน"
                                    />
                                </FormGroup>
                            </div>
                        }

                        <Fade in={this.state.isShowErr} style={styles.errAlert} tag="h5" className="mt-3">
                            <span style={styles.errorTxt}>{this.state.failedMsg}</span>
                        </Fade>
                        {this.state.registerState === 1 && <Button onClick={() => this.SendEmail()} style={styles.finishBtn}>
                            สมัครสมาชิก
                            <FontAwesomeIcon icon={faCaretRight} style={styles.finishBtnIco} />
                        </Button>
                        }
                        {this.state.registerState === 2 && <Button onClick={() => this.register()} style={styles.finishBtn}>
                            ลงทะเบียน
                            <FontAwesomeIcon icon={faCaretRight} style={styles.finishBtnIco} />
                        </Button>
                        }

                        <div style={styles.registerContainer}>
                            <Button style={styles.registerBtn} onClick={() => this.setState({ backToLogin: true })} color="link">เข้าสู่ระบบ</Button>
                            {this.state.registerState === 1 && <Button style={{ ...styles.registerBtn, color: '#bb4d63' }} onClick={() => this.setState({ registerState: 2 })} color="link">มีรหัสลงทะเบียนแล้ว</Button>}
                            {this.state.registerState === 2 && <Button style={{ ...styles.registerBtn, color: '#bb4d63' }} onClick={() => this.setState({ registerState: 1 })} color="link">ยังไม่มีรหัสลงทะเบียน</Button>}
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.activateComplete}>
                    <ModalBody>
                        <span style={styles.ModalHeader}>ลงทะเบียนสำเร็จ</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={styles.ModalBtnTxt} color="success" onClick={() => this.setState({ backToLogin: true })}>ตกลง</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.registerComplete}>
                    <ModalBody>
                        <p style={styles.ModalHeader}>สมัครสมาชิกสำเร็จ</p>
                        <span style={styles.text}>กรุณาตรวจสอบ Email เพื่อรับ "Activate Code"</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={styles.ModalBtnTxt} color="success" onClick={() => this.setState({ registerState: 2, registerComplete: false })}>ตกลง</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

let styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    loading: { width: '3rem', height: '3rem' },
    loginBox: { width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' },
    loginContainer: { flex: 1, alignItems: 'flex-start' },
    text: { fontFamily: 'DBH', fontSize: '1.5rem' },
    inputBox: { width: '60vw', margin: 'auto' },
    inputLabel: { textAlign: 'left', marginBottom: -5, fontSize: '2vw' },
    input: { fontFamily: 'DBH', fontWeight: "500", fontSize: '2vw' },
    finishBtn: { width: '60vw', margin: 'auto', fontFamily: 'DBH', fontSize: '2.5vw', backgroundColor: '#f0592b', borderWidth: 0 },
    finishBtnIco: { width: '1.75vw', fontSize: '1.5vw', color: '#fff' },
    registerContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '60vw', margin: 'auto' },
    registerBtn: { color: '#44b29c', fontFamily: 'DBH', fontSize: '2.5vw' },
    errorTxt: { textAlign: 'left', color: 'red', fontFamily: 'DBH', fontSize: '2rem' },
    errAlert: { width: '60vw', marginTop: '10px', margin: 'auto' },
    ModalHeader: { color: '#1c5379', fontFamily: 'DBH', fontSize: '1.75vw', fontWeight: '500' },
    ModalBtnTxt: { color: '#fff', fontFamily: 'DBH', fontSize: '1.75vw', fontWeight: '500' },
}