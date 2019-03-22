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
            goUserPage: false
        }
    }

    componentDidMount() {
        fetch('http://student.questionquick.com/profile',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(user => {
                this.setState({ isLoading: false, user, qstn }, () => console.log(
                    "user", this.state.user, '\n', "qstn", this.state.qstn
                ))
            })

    }

    onUnload(event) { // the method that will be used for both add and remove event
        event.preventDefault();
        event.returnValue = '';
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
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

        if (this.state.goUserPage) {
            return <Redirect push to="/user" />;
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
                    style={{ background: '#333', color: '#FFF' }}
                    onSelect={(selected) => {
                        // Add your code here
                    }}
                >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="home">
                        <NavItem eventKey="home">
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Home
                            </NavText>
                        </NavItem>
                        <NavItem
                            eventKey="user"
                            onClick={() => this.setState({ goUserPage: true })}
                        >
                            <NavIcon>
                                <i className="fa fa-fw fa-user-circle" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                ข้อมูลส่วนตัว
                            </NavText>
                        </NavItem>
                        <div style={{ width: 10, height: '80vh' }} />
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
                    {!this.state.pickedQuiz ?
                        <div style={{ zIndex: 2, width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' }}>
                            <p style={{ color: '#ff5f6d', fontFamily: 'DBH', fontSize: '4vw' }}>เลือกข้อสอบ</p>
                            {this.state.qstn.map((item, index) => {
                                return (
                                    <div key={index} style={styles.quizBox}>
                                        <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '2vw' }}>{item.title}</p>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>รหัสวิชา:</span> {item.code}</p>
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>ห้อง:</span> {this.getRoomListTxt(item.grade, item.rooms)}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>อาจารย์:</span> {item.teacher}</p>
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>รายวิชา:</span> {item.subjectCode}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>โรงเรียน:</span> {item.school}</p>
                                        </div>
                                        <div style={{ marginTop: 30 }}>
                                            {item.quizevents.map((quiz, i) => {
                                                return (
                                                    <div key={i} style={{ backgroundColor: i % 2 == 0 ? '#eee' : '#fff' }}>
                                                        <div style={styles.quizeventsBox}>
                                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>ระยะเวลา:</span> {this.getDateTxt(quiz.start)} - {this.getDateTxt(quiz.end)}</p>
                                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>เวลาทำข้อสอบ:</span> {this.getDurationTxt(quiz.duration)}</p>
                                                            <Button onClick={() => this.pickExam(quiz.exam, quiz, item)} disabled={!this.isAvailable(quiz.start, quiz.end)} color={this.isAvailable(quiz.start, quiz.end) ? 'success' : 'secondary'} style={{ height: 40, paddingTop: 0, paddingBottom: 0 }}>
                                                                <p style={{ color: '#fff', fontFamily: 'DBH', fontSize: '1.2vw', margin: 0 }}>ทำข้อสอบ</p>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        !this.state.isStart ?
                            <div style={{ zIndex: 2, width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <span style={{ color: '#ff5f6d', fontFamily: 'DBH', fontSize: '4vw' }}>{this.state.pickedQuiz.title}</span>
                                <span style={{ color: '#ff5f6d', fontFamily: 'DBH', fontSize: '2vw' }}>({this.state.pickedQuiz.code})</span>
                                <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '2vw' }}>เวลาทำข้อสอบ: <span style={{ color: '#337ab7', fontFamily: 'DBH', fontSize: '2vw' }}>{this.getDurationTxt(this.state.pickedQuizData.duration)}</span></p>
                                <Button onClick={() => this.start()} style={{ width: '30vw', height: '4vw', background: '#ffe00f', borderWidth: 0, padding: 0, borderRadius: '2vw', margin: 10, alignSelf: "center" }}>
                                    <span style={{ fontFamily: 'DBH', color: '#000', fontWeight: 'bolder', fontSize: '2vw' }}>เริ่มทำข้อสอบ</span>
                                    <FontAwesomeIcon icon={faCaretRight} style={{ width: '2vw', fontSize: '1.5vw', color: '#000' }} />
                                </Button>

                                <Button onClick={() => this.setState({ exam: null, pickedQuiz: null, pickedQuizData: null, fullTimer: 0, timer: 0 })} style={{ width: '30vw', height: '4vw', borderColor: '#ffe00f', borderStyle: 'solid', backgroundColor: '#fff', borderWidth: 2, padding: 0, borderRadius: '2vw', margin: 10, marginTop: 40, alignSelf: "center" }}>
                                    <span style={{ fontFamily: 'DBH', color: '#ffe00f', fontWeight: 'bolder', fontSize: '2vw' }}>เลือกข้อสอบ</span>
                                    <FontAwesomeIcon icon={faCaretRight} style={{ width: '2vw', fontSize: '1.5vw', color: '#ffe00f' }} />
                                </Button>
                            </div>
                            :
                            <div style={{ zIndex: 2, width: '85vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'row' }}>
                                <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#98def8', marginBottom: 10, marginTop: 10, marginLeft: 10, border: '2px solid #23b8f0', borderRadius: 10, overflow: 'hidden' }}>
                                        <p style={{ fontFamily: 'DBH', color: '#1c5379', alignSelf: 'center', fontSize: '1.5vw', flex: 1, fontWeight: 500, margin: 0 }}>ยินดีต้อนรับ</p>
                                        <div style={{ backgroundColor: '#fff' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesomeIcon icon={faUser} style={{ width: '1.6vw' }} />
                                                <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: '1.5vw' }}>: {this.state.user.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesomeIcon icon={faClock} style={{ width: '1.6vw' }} />
                                                <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: '1.5vw' }}>: {this.getDurationTxt(this.state.fullTimer)}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesomeIcon icon={faFileAlt} style={{ width: '1.6vw' }} />
                                                <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: '1.5vw' }}>: {this.state.pickedQuiz.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', marginBottom: 10, marginLeft: 10, border: '2px solid #44b29c', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ backgroundColor: this.getTimerBG(), display: 'flex', flexDirection: 'column', alignSelf: 'center', paddingLeft: 25, paddingRight: 25, margin: 5, borderRadius: 10, width: '95%' }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: '1.5vw', color: '#1c5379' }}>จับเวลาถอยหลัง</span>
                                            <span style={{ fontFamily: 'DBH', fontWeight: "bold", fontSize: '2.5vw', color: '#1c5379', marginTop: -10 }}>{this.state.isTimeOut ? 'Times Up!' : this.getTimeTxt(this.state.timer)}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff29e', marginBottom: 10, marginLeft: 10, border: '2px solid #ffeb67', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ width: 30 }} />
                                            <p style={{ fontFamily: 'DBH', color: '#1c5379', alignSelf: 'center', fontSize: '1.5vw', margin: 0, fontWeight: 500 }}><FontAwesomeIcon icon={faCalendarAlt} style={{ width: 30 }} />แผนผังข้อสอบ</p>
                                            <a href="">
                                                <FontAwesomeIcon id="toggler" icon={faInfoCircle} style={{ width: 30, color: '#1c5379' }} />
                                            </a>
                                        </div>
                                        <div style={{ backgroundColor: '#fff', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: '1.25vw' }}>{this.getProgress()}</span>
                                            <div style={{ height: 2, backgroundColor: '#ffeb67' }} />
                                            <div style={{ display: 'flex', flex: 1, overflowY: 'scroll', }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-start' }}>
                                                    {this.state.exam.map((d, index) => {
                                                        return (
                                                            <Button key={index} onClick={() => this.setState({ current: index })} style={{ width: '1.5vw', height: '1.5vw', border: this.state.current === index ? '2px solid #337ab7' : '2px solid transparent', backgroundColor: this.state.answer[index] !== undefined ? '#44b29c' : '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0 }}>
                                                                <p style={{ fontSize: '1.25vw', fontFamily: 'DBH', fontWeight: 500, color: '#000', marginTop: -5 }}>{index + 1}</p>
                                                            </Button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <UncontrolledCollapse toggler="#toggler">
                                                <div style={{ height: 2, backgroundColor: '#ffeb67' }} />
                                                <div style={{ backgroundColor: '#fff29e' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ width: '1.5vw', height: '1.5vw', border: '2px solid #337ab7', backgroundColor: '#fff', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 }} />
                                                        <span style={{ fontFamily: 'DBH', fontSize: '1vw', fontWeight: '500', marginTop: 5 }}>ข้อปัจจุบัน</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ width: '1.5vw', height: '1.5vw', backgroundColor: '#44b29c', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 }} />
                                                        <span style={{ fontFamily: 'DBH', fontSize: '1vw', fontWeight: '500', marginTop: 5 }}>ข้อที่ทำแล้ว</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ width: '1.5vw', height: '1.5vw', backgroundColor: '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 }} />
                                                        <span style={{ fontFamily: 'DBH', fontSize: '1vw', fontWeight: '500', marginTop: 5 }}>ข้อที่ยังไม่ได้ทำ</span>
                                                    </div>
                                                </div>
                                            </UncontrolledCollapse>
                                        </div>
                                    </div>
                                    <div style={{ alignSelf: 'center', marginBottom: 10, marginLeft: 10, width: '95%' }}>
                                        {!this.isFinish() ?
                                            <Button onClick={() => this.setState({ modal: true })} style={{ width: '100%', background: '#ffe00f', marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, marginRight: 10 }}>
                                                <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#000', fontSize: '1.75vw' }}>ส่งข้อสอบ</span>
                                                <FontAwesomeIcon icon={faCaretRight} style={{ width: '1.75vw', fontSize: '1.5vw', color: '#000' }} />
                                            </Button>
                                            :
                                            <Button onClick={() => this.setState({ modal: true })} style={{ width: '100%', background: '#6ebb1f', marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, marginRight: 10 }}>
                                                <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.75vw' }}>ส่งข้อสอบ</span>
                                                <FontAwesomeIcon icon={faCaretRight} style={{ width: '1.75vw', fontSize: '1.5vw', color: '#fff' }} />
                                            </Button>
                                        }
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 4 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h1 style={{ fontFamily: 'DBH', fontWeight: 'bolder', color: '#ff5f6d', fontSize: '3vw', textAlign: 'left', marginTop: 12, marginLeft: 20 }}>ข้อที่ {this.state.current + 1} จาก {this.state.exam.length}</h1>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                            {this.state.current > 0 ?
                                                <Button onClick={() => this.setState({ current: this.state.current - 1 })} style={{ width: '12vw', background: '#f1673e', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                                    <FontAwesomeIcon icon={faCaretLeft} style={{ width: '1.75vw', fontSize: '1.5vw' }} />
                                                    <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.75vw' }}>ย้อนกลับ</span>
                                                </Button>
                                                :
                                                <Button disabled onClick={() => null} style={{ width: '12vw', background: '#aaa', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                                    <FontAwesomeIcon icon={faCaretLeft} style={{ width: '1.75vw', fontSize: '1.5vw' }} />
                                                    <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.75vw' }}>ย้อนกลับ</span>
                                                </Button>
                                            }
                                            {this.state.current !== (this.state.exam.length - 1) ?
                                                <Button onClick={() => this.setState({ current: this.state.current + 1 })} style={{ width: '12vw', background: '#f1673e', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                                    <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.75vw' }}>ถัดไป</span>
                                                    <FontAwesomeIcon icon={faCaretRight} style={{ width: '1.75vw', fontSize: '1.5vw' }} />
                                                </Button>
                                                :
                                                <Button disabled onClick={() => null} style={{ width: '12vw', background: '#aaa', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                                    <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.75vw' }}>ถัดไป</span>
                                                    <FontAwesomeIcon icon={faCaretRight} style={{ width: '1.75vw', fontSize: '1.5vw' }} />
                                                </Button>
                                            }
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff', margin: 10, marginTop: 0, border: '2px solid #ff5f6d', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ overflowY: 'scroll', display: 'flex', flex: 1, flexDirection: 'column' }}>
                                            <span style={{ fontFamily: 'DBH', fontSize: '1.8vw', fontWeight: 500, textAlign: 'left', marginLeft: 10, marginBottom: 20, color: '#1c5379' }}>
                                                {this.state.exam[this.state.current] && this.state.exam[this.state.current].text}
                                            </span>
                                            <div >
                                                {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                                                    this.getMedia(this.state.exam[this.state.current].media, true)
                                                }
                                            </div>
                                            <div style={{ display: 'flex', /*flex: 1,*/ flexWrap: 'wrap', flexDirection: 'row', marginTop: 10 }}>
                                                {this.state.exam[this.state.current] && this.state.exam[this.state.current].choices.map((c, index) => {
                                                    return (
                                                        <div key={index} style={{ width: '45%', opacity: this.state.isTimeOut ? 0.5 : 1, marginBottom: 20, marginLeft: '2.5%', }}>
                                                            <div style={{ backgroundColor: '#eee', borderRadius: 30, paddingBottom: 10 }}>
                                                                <Button
                                                                    onClick={() => {
                                                                        if (this.state.answer[this.state.current] === JSON.stringify({ "qid": this.state.exam[this.state.current].qid, "cid": c.cid })) {
                                                                            this.state.answer[this.state.current] = undefined
                                                                            this.forceUpdate()
                                                                        }
                                                                        else {
                                                                            this.state.answer[this.state.current] = { "qid": this.state.exam[this.state.current].qid, "cid": c.cid }
                                                                            this.forceUpdate()
                                                                            // if (this.state.current < this.state.exam.length - 1) {
                                                                            //     this.setState({ current: this.state.current + 1 })
                                                                            // }
                                                                            // else {
                                                                            //     this.forceUpdate()
                                                                            // }
                                                                        }
                                                                    }}
                                                                    disabled={this.state.isTimeOut}
                                                                    style={{ width: '97%', backgroundColor: JSON.stringify(this.state.answer[this.state.current]) === JSON.stringify({ "qid": this.state.exam[this.state.current].qid, "cid": c.cid }) ? '#2abaf0' : '#fff', border: '2px solid #2abaf0', padding: 0, borderRadius: 30, marginTop: 10 }}
                                                                >
                                                                    <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#1c5379', fontSize: '1.75vw' }}>{c.text}</span>
                                                                </Button>
                                                                {c.media && this.getMedia(c.media, false)}
                                                            </div>
                                                            <div style={{ display: 'flex', flex: 1 }} />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Modal isOpen={this.state.modal} toggle={() => this.setState({ modal: !this.state.modal })} className={this.props.className}>
                                    <ModalHeader style={{ paddingBottom: 0 }}><p style={{ color: '#1c5379', fontFamily: 'DBH', fontSize: '1.8vw', fontWeight: 'bolder', }}>ยืนยัน</p></ModalHeader>
                                    <ModalBody>
                                        {this.isFinish() ?
                                            <p style={{ color: '#1c5379', fontFamily: 'DBH', fontSize: '1.75vw', fontWeight: '500' }}>คุณต้องการส่งคำตอบใช่หรอไม่?</p>
                                            :
                                            <div>
                                                <p style={{ color: '#1c5379', fontFamily: 'DBH', fontSize: '1.75vw', fontWeight: '500' }}>คุณต้องการส่งคำตอบใช่หรอไม่?</p>
                                                <p style={{ color: '#1c5379', fontFamily: 'DBH', fontSize: '1.75vw', fontWeight: '500', display: 'flex', flexDirection: 'row', color: 'red', alignItems: 'center' }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} style={{ width: '1.75vw', fontSize: '1.5vw', marginRight: 5 }} />ยังเลือกคำตอบไม่ครบทุกข้อ
                                            </p>
                                            </div>
                                        }
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button onClick={() => this.submit()} style={{ width: '50%', background: '#00adee', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.5vw' }}>ยืนยันการส่งคำตอบ</span>
                                        </Button>
                                        <Button onClick={() => this.setState({ modal: false })} style={{ width: '50%', background: 'red', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.5vw' }}>ยกเลิก</span>
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                    }
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