import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav from '../_component/sideNav'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

class CodeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

let word = {
    th: {
        setting: 'ตั้งค่า',
        logout: 'ออกจากระบบ',
        cancel: 'ยกเลิก',
    },
    en: {
        setting: 'Setting',
        logout: 'Log out',
        cancel: 'Cancel',
    }
}

export default class Setting extends Component {
    constructor() {
        super();
        this.state = {
            goUserPage: false,
            goTestPage: false,
            redirectHome: false,
        }
    }

    componentDidMount() {
        fetch('http://student.questionquick.com/profile/',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(e => {
                if (e.message === 'Not Login') {
                    this.setState({ redirectHome: true })
                }
            })
    }


    logout() {
        fetch('http://student.questionquick.com/session/',
            {
                credentials: 'include',
                // headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            })
            .then(res => res.json())
            .then(e => {
                if (e.code === '401') {
                    throw new CodeError(e.message, e.code);
                }
                else {
                    this.setState({ isLoading: false }, () => this.setState({ redirectHome: true }))
                    console.log(e)
                }

            })
            .catch(err => {
                this.setState({ isLoading: false }, () => this.setState({ redirectHome: true }))
                console.log('error', err)
            })
    }


    render() {
        if (this.state.redirectHome) {
            return <Redirect push to="/" />;
        }

        return (
            <div className="login loginContainer">
                <SideNav page={'setting'} />
                {this.state.isLoading &&
                    <div style={styles.loadingContainer}>
                        <Spinner type="grow" color="warning" style={styles.loading} />
                    </div>
                }
                <div className='quizBox'>
                    <div style={styles.container}>
                        <p style={styles.topic}>{word[window.language].setting}</p>
                        <div style={styles.box}>
                            <p style={styles.settingTopic}>ภาษา/Language</p>
                            <div style={styles.languageBox}>
                                <Button
                                    style={{ ...styles.languageBtn, color: window.language === 'th' ? '#2abaf0' : '#aaa' }}
                                    color={'link'}
                                    onClick={() => {
                                        window.language = 'th'
                                        localStorage.setItem('language', 'th');
                                        this.forceUpdate()
                                    }}
                                >
                                    ภาษาไทย
                                </Button>
                                <Button
                                    style={{ ...styles.languageBtn, color: window.language === 'en' ? '#2abaf0' : '#aaa' }}
                                    color={'link'}
                                    onClick={() => {
                                        window.language = 'en'
                                        localStorage.setItem('language', 'en');
                                        this.forceUpdate()
                                    }}
                                >
                                    English
                                </Button>
                            </div>
                        </div>
                        <Button color={'danger'} style={styles.logoutBtn} onClick={() => this.setState({ confirmLogout: true })}>
                            {word[window.language].logout}
                        </Button>
                    </div>
                    <img src={require('../image/decorate02.png')} style={styles.decotateLeft} alt={'decorate02'} />
                    <img src={require('../image/decorate01.png')} style={styles.decotateRight} alt={'decorate01'} />
                </div>

                <Modal isOpen={this.state.confirmLogout} toggle={() => this.setState({ confirmLogout: false })}>
                    <ModalHeader toggle={() => this.setState({ confirmLogout: false })}>
                        <span style={styles.logoutHeader}>{word[window.language].logout}</span>
                    </ModalHeader>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.setState({ confirmLogout: false }, () => this.logout())}>{word[window.language].logout}</Button>
                        {' '}
                        <Button color="secondary" onClick={() => this.setState({ confirmLogout: false })}>{word[window.language].cancel}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    loading: { width: '3rem', height: '3rem' },
    container: { zIndex: 2, width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginLeft: '60px' },
    topic: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px' },
    decotateLeft: { bottom: 0, left: 0, position: 'absolute', width: '25vw', marginLeft: '60px' },
    decotateRight: { bottom: 0, right: 0, position: 'absolute', width: '25vw' },
    box: { display: 'flex', overflowY: 'scroll', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 10, marginRight: 10, alignItems: 'center' },
    settingTopic: { fontFamily: 'DBH', fontSize: '34px' },
    logoutBtn: { marginTop: 'auto', fontFamily: 'DBH', fontSize: '20px' },
    logoutHeader: { color: '#222', fontFamily: 'DBH', fontSize: '2vw', alignSelf: 'flex-start' },
    languageBox: {},
    languageBtn: { marginLeft: 10, fontFamily: 'DBH', fontSize: '30px' }
}