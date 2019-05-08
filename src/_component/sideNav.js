import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import ClickOutside from 'react-click-outside'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class CodeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

let word = {
    th: {
        home: 'หน้าแรก',
        personalInfo: 'ข้อมูลส่วนตัว',
        history: 'ประวัติการสอบ',
        setting: 'ตั้งค่า',
        logout: 'ออกจากระบบ',
        cancel: 'ยกเลิก',
        stopExam: 'หยุดทำข้อสอบ',
        stopExamWarning: 'คุณต้องการยกเลิกการทำข้อสอบหรือไม่ ข้อมูลข้อสอบชุดนี้จะถูกบันทึกว่า "ไม่ได้ทำการส่งข้อสอบ"',
    },
    en: {
        home: 'Home',
        personalInfo: 'Personal Infomation',
        history: 'Exam History',
        setting: 'Setting',
        logout: 'Log out',
        cancel: 'Cancel',
        stopExam: 'Stop doing the exam',
        stopExamWarning: 'Do you want to stop doing the exam? This answer sheet will be saved with "Do not submit the exam"',
    }
}

export default class Setting extends Component {
    constructor() {
        super();
        this.state = {
            confirmLogout: false,
            goUserPage: false,
            goTestPage: false,
            goSettingPage: false,
            goHistoryPage: false,

            quizModal: false,
            navAct: null,
        }
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

    navigate(act, warning) {
        if (warning && act !== 'goTestPage') {
            this.setState({ quizModal: true, navAct: act })
        }
        else {
            this.setState({ [act]: true })
        }
    }

    stopQuizModal(act) {
        return (
            <Modal isOpen={this.state.quizModal} toggle={() => this.setState({ quizModal: false })}>
                <ModalHeader toggle={() => this.setState({ quizModal: false })}>{word[window.language].stopExam} ?</ModalHeader>
                <ModalBody>
                    {word[global.language].stopExamWarning}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => this.setState({ quizModal: false }, () => { this.setState({ [this.state.navAct]: true }) })}>{word[window.language].stopExam}</Button>{' '}
                    <Button color="secondary" onClick={() => this.setState({ quizModal: false/*, isStart: true, quitConfirmed: false*/ })}>{word[window.language].cancel}</Button>
                </ModalFooter>
            </Modal>
        )
    }

    render() {
        let { page, isQuizStart } = this.props
        if (this.state.redirectHome) {
            return <Redirect push to="/" />;
        }

        if (this.state.goUserPage && page !== 'user') {
            return <Redirect push to="/user" />;
        }

        if (this.state.goTestPage && page !== 'home') {
            return <Redirect push to="/test" />;
        }

        if (this.state.goSettingPage && page !== 'setting') {
            return <Redirect push to="/setting" />;
        }

        if (this.state.goHistoryPage && page !== 'history') {
            return <Redirect push to="/history" />;
        }

        return (
            <ClickOutside
                onClickOutside={() => {
                    window.sideNav = false
                    this.forceUpdate()
                }}
            >
                <SideNav
                    expanded={window.sideNav}
                    onToggle={(expanded) => {
                        window.sideNav = !window.sideNav
                        this.forceUpdate()
                    }}
                    style={styles.sideNav}
                    onSelect={(selected) => {
                        // Add your code here
                    }}
                >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected={page} style={styles.sideNavNav}>
                        <NavItem
                            eventKey="home"
                            onClick={() => this.navigate('goTestPage', isQuizStart)}
                            active={page === 'home'}
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={styles.ico} />
                            </NavIcon>
                            <NavText>
                                {word[window.language].home}
                            </NavText>
                        </NavItem>
                        <NavItem
                            eventKey="user"
                            onClick={() => this.navigate('goUserPage', isQuizStart)}
                            active={page === 'user'}
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-user-circle" style={styles.ico} />
                            </NavIcon>
                            <NavText>
                                {word[window.language].personalInfo}
                            </NavText>
                        </NavItem>
                        <NavItem
                            eventKey="history"
                            onClick={() => this.navigate('goHistoryPage', isQuizStart)}
                            active={page === 'history'}
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-history" style={styles.ico} />
                            </NavIcon>
                            <NavText>
                                {word[window.language].history}
                            </NavText>
                        </NavItem>
                        <NavItem
                            eventKey="setting"
                            onClick={() => this.navigate('goSettingPage', isQuizStart)}
                            active={page === 'setting'}
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-cog" style={styles.ico} />
                            </NavIcon>
                            <NavText>
                                {word[window.language].setting}
                            </NavText>
                        </NavItem>
                        <div style={{ display: 'flex', flex: 1 }} />
                        {window.sideNav &&
                            <Button color="link" style={{ color: '#fff' }} onClick={() => this.setState({ confirmLogout: true })}>
                                {word[window.language].logout}
                            </Button>
                        }
                    </SideNav.Nav>
                </SideNav>

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

                {this.stopQuizModal(isQuizStart)}

            </ClickOutside>
        )
    }
}

const styles = {
    sideNav: { background: '#333', color: '#FFF', display: 'flex', flex: 1, flexDirection: 'column' },
    sideNavNav: { display: 'flex', flexDirection: 'column', flex: 1 },
    ico: { fontSize: '1.75em' },
    logoutHeader: { color: '#222', fontFamily: 'DBH', fontSize: '2vw', alignSelf: 'flex-start' },
}