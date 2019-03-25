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

var subjectCode = [
    { code: 'thai', label: 'ภาษาไทย' },
    { code: 'math', label: 'คณิตศาสตร์' },
    { code: 'sci', label: 'วิทยาศาสตร์' },
    { code: 'soc', label: 'สังคมศึกษา' },
    { code: 'health', label: 'สุขศึกษา' },
    { code: 'art', label: 'ศึลปะ' },
    { code: 'tech', label: 'อาชีพ เทคโนโลยี' },
    { code: 'eng', label: 'ภาษาอังกฤษ' },
    { code: 'chi', label: 'ภาษาจีน' },
    { code: 'art', label: 'ภาษาญีปุ่น' },
]

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
            goUserPage: false,
            answersheet: null,
            isSendingAnswer: false
        }
    }

    componentDidMount() {
        console.log('cdm')
        let _this = this
        console.log("window.location", window.location)
        window.addEventListener("beforeunload", (e) => this.onUnload(e, _this))
        window.history.pushState(null, null, window.location.href);
        // window.onpopstate = function (e) {
        //     if (_this.state.isStart) {
        //         _this.setState({ quizModal: true })
        //         window.history.go(1)
        //     }
        //     else {
        //         window.history.go(0)
        //     }
        // };
        fetch('http://student.questionquick.com/quizevent',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(qstn => {
                console.log('qstn', qstn)
                if (qstn.message === 'Not Login') {
                    console.log('do if')
                    fetch('http://student.questionquick.com/session/',
                        {
                            credentials: 'include',
                            //headers: { 'Content-Type': 'application/json' },
                            method: 'DELETE',
                        })
                        .then(res => res.json())
                        .then(e => {
                            if (e.code === '401') {
                                throw { message: e.message }
                            }
                            else {
                                this.setState({ isLoading: false/*, redirectHome: true */ })
                                console.log(e)
                            }

                        })
                        .catch(err => {
                            this.setState({ isLoading: false }, () => /*alert(err.message)*/null)
                            console.log('error', err)
                        })
                }
                else {
                    console.log('do else')
                    fetch('http://student.questionquick.com/session/',
                        {
                            credentials: 'include',
                        })
                        .then(res => res.json())
                        .then(e => {
                            if (e.code === '401') {
                                throw { message: e.message }
                            }
                            else {
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

                        })
                        .catch(err => {
                            this.setState({ isLoading: false }, () => /*alert(err.message)*/null)
                            console.log('error', err)
                        })
                }
            })
            .catch(e => {
                console.log("err", e)
                this.setState({ data: [] })
            })
    }

    onUnload(event, _this) { // the method that will be used for both add and remove event
        if (_this.state.isStart) {
            event.preventDefault();
            event.returnValue = '';
        }
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
    }

    start() {
        console.log(this.state.pickedQuiz, this.state.pickedQuizData)
        this.setState({ isLoading: true }, () => {
            fetch('http://student.questionquick.com/quiz/',
                {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({ 'qeid': this.state.pickedQuizData.qeid })
                })
                .then(res => res.json())
                .then(e => {
                    if (e.message === 'Already test') {
                        alert('คุณได้ทำข้อสอบชุดนี้แล้ว')
                        this.setState({ isLoading: false })
                    }
                    else if (e.message === 'Out of range date') {
                        alert('หมดเวลาทำข้อสอบแล้ว')
                        this.setState({ isLoading: false })
                    }
                    else {
                        console.log('e', e)
                        this.setState({ isStart: true, isLoading: false, answersheet: e }, () => {
                            this.clockCall = setInterval(() => {
                                this.decrementClock();
                            }, 1000);
                        })
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false }, () => /*alert(err.message)*/null)
                    console.log('error', err)
                })
        })
    }

    decrementClock = () => {
        // this.setState((prevstate) => ({ timer: prevstate.timer-1 },() => {});
        this.setState({ timer: this.state.timer - 1 }, () => {
            if (this.state.timer <= 0) {
                this.setState({ isTimeOut: true })
                clearInterval(this.clockCall);
            }
        })
    };

    getTimeTxt(sec) {
        var sec_num = parseInt(sec, 10); // don't forget the second param
        // var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor(sec_num / 60);
        var seconds = sec_num - (minutes * 60);

        // if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return /*hours + ':' +*/ minutes + ':' + seconds;
    }

    isFinish() {
        for (let i in this.state.exam) {
            if (this.state.answer[i] === undefined) {
                return false
            }
        }
        return true
    }

    getProgress() {
        let pickCount = 0
        for (let i in this.state.exam) {
            if (this.state.answer[i] !== undefined) {
                pickCount++
            }
        }
        return pickCount + '/' + this.state.exam.length
    }

    getMedia(media, isQuestion) {
        if (media.type === 'image') {
            return <div style={{ marginBottom: isQuestion ? 20 : 0, marginTop: isQuestion ? 0 : 10 }}>
                <img src={'http://dev.hatyaiapp.com:11948' + media.path} alt={''} style={{ height: isQuestion ? '30vh' : 'auto', width: isQuestion ? 'auto' : '18vw', borderRadius: 7 }} />
            </div>
        }
        else if (media.type === 'video') {
            return <div style={{ width: isQuestion ? '23vw' : '18vw', marginBottom: isQuestion ? 20 : 0, margin: 'auto', marginTop: isQuestion ? 0 : 10, borderRadius: 7, overflow: 'hidden' }}>
                <Player
                    controls
                    fluid
                    style={{ width: isQuestion ? '23vw' : '18vw', }}
                    width={isQuestion ? '23vw' : '18vw'}
                    height={'30vw'}
                    poster={'http://dev.hatyaiapp.com:11948' + media.path.replace('mp4', 'png')}
                    src={'http://dev.hatyaiapp.com:11948' + media.path}
                />
            </div>
        }
        else if (media.type === 'audio') {
            return <div style={{ width: isQuestion ? '30vw' : '18vw', marginBottom: isQuestion ? 20 : 0, margin: 'auto', marginTop: isQuestion ? 0 : 10 }}>
                <ReactAudioPlayer
                    style={{ width: '100%' }}
                    src={'http://dev.hatyaiapp.com:11948' + media.path}
                    autoPlay={false}
                    controls
                    controlsList="nodownload"
                />
            </div>
        }
        else {
            return <p style={{ color: '#000' }}>???????????</p>
        }
    }

    getTimerBG() {
        //this.state.isTimeOut ? '#ffafaf' : '#b3e0d7'

        if (this.state.isTimeOut) {
            return '#ffafaf'
        }
        else if (this.state.fullTimer * 0.5 < this.state.timer) {
            return '#b3e0d7'
        }
        else if (this.state.fullTimer * 0.25 < this.state.timer) {
            return '#f0f190'
        }
        else {
            return '#ffc879'
        }
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

    getRoomListTxt(grade, rooms) {
        let txt = ''
        for (let i in rooms) {
            txt += ('ม.' + grade + '/' + rooms[i] + ', ')
        }
        return txt.slice(0, -2)
    }

    getDateTxt(d) {
        let date = new Date(d)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' น.'
    }

    getDurationTxt(duration) {
        var h = Math.floor(duration / 60);
        var m = duration % 60;
        let txt = ''
        if (h !== 0) {
            txt += h + ' ชั่วโมง ';
        }
        if (m !== 0) {
            txt += m + ' นาที'
        }
        return txt
    }

    isAvailable(start, end) {
        let now = Date.now()
        return now > Date.parse(start) && now < Date.parse(end)
    }

    pickExam(examId, data, item) {
        this.setState({ isLoading: true }, () => {
            fetch('http://student.questionquick.com/exam/' + examId + '/questions',
                {
                    credentials: 'include',
                })
                .then(res => res.json())
                .then(exam => {
                    console.log(exam, data, item)
                    this.setState({ isLoading: false, exam, pickedQuiz: item, pickedQuizData: data, fullTimer: data.duration, timer: data.duration * 60 })
                })
                .catch(e => {
                    console.log(e)
                    this.setState({ isLoading: false })
                })
        })
    }

    submit() {
        console.log(this.state.answer, this.state.answersheet)
        this.setState({ isSendingAnswer: true }, () => {
            fetch('http://student.questionquick.com/quiz/' + this.state.answersheet._id, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify({
                    answers: this.state.answer
                })
            })
                .then(res => res.json())
                .then(json => {
                    console.log('res', json)
                    this.setState({ quizModal: false, pickedQuiz: null, pickedQuizData: null, isSendingAnswer: false, modal: false, answer: [], current: 0, isStart: false })
                })
                .catch(err => {
                    this.setState({ quizModal: false, pickedQuiz: null, pickedQuizData: null, isSendingAnswer: false, modal: false, answer: [], current: 0, isStart: false })
                    console.log("err", err)
                })
        })
    }

    getOutOfTimeTxt(end, start) {
        if (this.isAvailable(end, start)) {
            return null
        }
        else {
            let now = Date.now()
            if (now < Date.parse(start)) {
                return <span style={{ color: 'red', fontSize: '0.75em' }}> (ยังไม่ถึงเวลาทำข้อสอบ)</span>
            }
            else if (now > Date.parse(end)) {
                return <span style={{ color: 'red', fontSize: '0.75em' }}> (เลยเวลาทำข้อสอบแล้ว)</span>
            }
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
                    style={{ background: '#333', color: '#FFF', display: 'flex', flex: 1, flexDirection: 'column' }}
                    onSelect={(selected) => {
                        // Add your code here
                    }}
                >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="home" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <NavItem
                            eventKey="home"
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
                            onClick={() => this.setState({ goUserPage: true })}
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
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>อาจารย์:</span> {item.teacher.name}</p>
                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0 }}><span style={{ color: '#999' }}>รายวิชา:</span> {subjectCode.find(sc => { return item.subjectCode == sc.code }).label}</p>
                                        </div>
                                        <div style={{ marginTop: 30 }}>
                                            {item.quizevents.map((quiz, i) => {
                                                return (
                                                    <div key={i} style={{ backgroundColor: i % 2 == 0 ? '#eee' : '#fff' }}>
                                                        <div style={styles.quizeventsBox}>
                                                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: '1.6vw', margin: 0, width: '40vw', textAlign: 'left' }}><span style={{ color: '#999' }}>ระยะเวลา:</span> {this.getDateTxt(quiz.start)} - {this.getDateTxt(quiz.end)}{this.getOutOfTimeTxt(quiz.start, quiz.end)}</p>
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
                                            <FontAwesomeIcon id="toggler" icon={faInfoCircle} style={{ width: 30, color: '#1c5379' }} />
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
                                <Modal isOpen={this.state.modal} toggle={() => this.setState({ modal: this.state.isSendingAnswer ? true : !this.state.modal })} className={this.props.className}>
                                    <ModalHeader style={{ paddingBottom: 0 }}><p style={{ color: '#1c5379', fontFamily: 'DBH', fontSize: '1.8vw', fontWeight: 'bolder', }}>ยืนยัน</p></ModalHeader>
                                    <ModalBody>
                                        {this.state.isSendingAnswer ?
                                            <Spinner type="grow" color="warning" style={{ width: '3rem', height: '3rem', margin: 'auto' }} />
                                            :
                                            this.isFinish() ?
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
                                        <Button disabled={this.state.isSendingAnswer} onClick={() => this.submit()} style={{ width: '50%', background: '#00adee', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '1.5vw' }}>ยืนยันการส่งคำตอบ</span>
                                        </Button>
                                        <Button disabled={this.state.isSendingAnswer} onClick={() => this.setState({ modal: false })} style={{ width: '50%', background: 'red', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 }}>
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