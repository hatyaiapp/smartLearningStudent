import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse, Spinner } from 'reactstrap';
import { faUser, faClock, faFileAlt, faCalendarAlt, faCaretRight, faCaretLeft, faExclamationCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class Test extends Component {
    constructor() {
        super();
        this.state = {
            type: 'student',
            data: [],
            current: 0,
            answer: [],
            fullTimer: 0,
            timer: 0,
            isTimeOut: false,
            isStart: false,
            modal: false,
            expanded: false,
            redirectHome: false,
            pickedQuiz: null,
            user: {},
            qstn: [],
            exam: [],
            quizModal: false,
            goTestPage: false
        }
    }

    componentDidMount() {
        fetch('http://student.questionquick.com/profile',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(user => {
                console.log(user)
                this.setState({ isLoading: false, user })
            })

    }

    logout() {
        if (this.state.expanded) {
            fetch('http://student.questionquick.com/session/',
                {
                    credentials: 'include',
                    // headers: { 'Content-Type': 'application/json' },
                    method: 'DELETE',
                })
                .then(res => res.json())
                .then(e => {
                    if (e.code === '401') {
                        throw { message: e.message }
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
    }

    render() {
        if (this.state.redirectHome) {
            return <Redirect push to="/" />;
        }

        if (this.state.goTestPage) {
            return <Redirect push to="/test" />;
        }

        return (
            <div className="login loginContainer">
                {this.state.isLoading ?
                    <div style={{ display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                        <Spinner type="grow" color="warning" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    :
                    null
                }
                <Modal isOpen={this.state.quizModal} toggle={() => this.setState({ quizModal: false })}>
                    <ModalHeader toggle={() => this.setState({ quizModal: false }, () => alert('หยุดทำข้อสอบ'))}>หยุดทำข้อสอบ ?</ModalHeader>
                    <ModalBody>
                        คุณต้องการยกเลิกการทำข้อสอบหรือไม่ {'\n'}ข้อมูลข้อสอบชุดนี้จะถูกบันทึกว่า "ไม่ได้ทำการส่งข้อสอบ"
                     </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.setState({ quizModal: false }, () => window.history.go(0))}>หยุดทำข้อสอบ</Button>{' '}
                        <Button color="secondary" onClick={() => this.setState({ quizModal: false })}>ยกเลิก</Button>
                    </ModalFooter>
                </Modal>
                <SideNav
                    expanded={this.state.expanded}
                    disabled={this.state.isLoading}
                    onToggle={(expanded) => {
                        this.setState({ expanded });
                    }}
                    style={{ background: '#333', color: '#FFF', display: 'flex', flex: 1, flexDirection: 'column' }}
                    onSelect={(selected) => {
                        // Add your code here
                    }}
                >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="user" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <NavItem
                            eventKey="home"
                            onClick={() => this.setState({ goTestPage: true })}
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                หน้าแรก
                            </NavText>
                        </NavItem>
                        <NavItem
                            eventKey="user"
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-user-circle" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                ข้อมูลส่วนตัว
                            </NavText>
                        </NavItem>
                        <div style={{ display: 'flex', flex: 1 }} />
                        <NavItem
                            eventKey="logout"
                            disabled={!this.state.expanded}
                            onClick={() => this.logout()}
                        >
                            <NavIcon>
                                {/* <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                            </NavIcon>
                            <NavText>
                                Logout
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
                <div className='quizBox'>
                    <div style={{ zIndex: 2, width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' }}>
                        <p style={{ color: '#ff5f6d', fontFamily: 'DBH', fontSize: '4vw' }}>ข้อมูลส่วนตัว</p>
                        <p style={{ color: '#222', fontFamily: 'DBH', fontSize: '2vw', alignSelf: 'flex-start', marginLeft: 20 }}><span style={{ color: '#999' }}>ชื่อ:</span> {this.state.user && this.state.user.name}</p>
                        <p style={{ color: '#222', fontFamily: 'DBH', fontSize: '2vw', alignSelf: 'flex-start', marginLeft: 20 }}><span style={{ color: '#999' }}>ห้อง:</span> ม.{this.state.user && this.state.user.grade}/{this.state.user && this.state.user.room}</p>
                        <p style={{ color: '#222', fontFamily: 'DBH', fontSize: '2vw', alignSelf: 'flex-start', marginLeft: 20 }}><span style={{ color: '#999' }}>โรงเรียน:</span> {this.state.user && this.state.user.school && this.state.user.school.name}</p>
                    </div>
                    <img src={require('../image/decorate02.png')} style={{ bottom: 0, left: 0, position: 'absolute', width: '25vw' }} alt={'decorate02'} />
                    <img src={require('../image/decorate01.png')} style={{ bottom: 0, right: 0, position: 'absolute', width: '25vw' }} alt={'decorate01'} />
                </div>
            </div>
        );
    }
}

const styles = {
    quizBox: {
        borderRadius: 10,
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#2abaf0',
        width: '95%',
        padding: '5px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '20px',
    },
    quizeventsBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    }
}

export default Test;