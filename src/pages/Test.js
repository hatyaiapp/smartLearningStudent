import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse, Spinner, CustomInput, Collapse } from 'reactstrap';
import { faUser, faClock, faFileAlt, faCalendarAlt, faCaretRight, faCaretLeft, faExclamationCircle, faInfoCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import SideNav from '../_component/sideNav'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

var subjectCode = [
    { code: 'thai', th: 'ภาษาไทย', en: 'Thai' },
    { code: 'math', th: 'คณิตศาสตร์', en: 'Math' },
    { code: 'sci', th: 'วิทยาศาสตร์', en: 'Science' },
    { code: 'soc', th: 'สังคมศึกษา', en: 'Social' },
    { code: 'health', th: 'สุขศึกษา', en: 'Health Education' },
    { code: 'art', th: 'ศึลปะ', en: 'Art' },
    { code: 'tech', th: 'อาชีพ เทคโนโลยี', en: 'Jobs and Technology' },
    { code: 'eng', th: 'ภาษาอังกฤษ', en: 'English' },
    { code: 'chi', th: 'ภาษาจีน', en: 'Chinese' },
    { code: 'art', th: 'ภาษาญีปุ่น', en: 'Japanese' },
]

var word = {
    th: {
        m: 'ม.',
        hour: 'ชั่วโมง',
        minute: 'นาที',
        notYetTime: 'ยังไม่ถึงเวลาทำข้อสอบ',
        overDeadline: 'เลยเวลาทำข้อสอบ',
        chooseExam: 'เลือกข้อสอบ',
        classId: 'รหัสวิชา',
        room: 'ห้อง',
        teacher: 'ผู้สอน',
        course: 'รายวิชา',
        period: 'ระยะเวลา',
        duration: 'เวลาทำข้อสอบ',
        startQuiz: 'ทำข้อสอบ',
        noExam: 'ยังไม่มีข้อสอบในขณะนี้',
        questionAmount: 'จำนวนคำถาม',
        welcome: 'ยินดีต้อนรับ',
        countdown: 'จับเวลาถอยหลัง',
        questionDiagram: 'แผนผังข้อสอบ',
        current: 'ข้อปัจจุบัน',
        selected: 'ข้อที่ทำแล้ว',
        notSelected: 'ข้อที่ยังไม่ได้ทำ',
        submit: 'ส่งข้อสอบ',
        question: 'ข้อที่',
        from: 'จาก',
        back: 'ย้อนกลับ',
        forward: 'ถัดไป',
        confirmSubmit: 'คุณต้องการส่งคำตอบใช่หรอไม่',
        notFinish: 'ยังเลือกคำตอบไม่ครบทุกข้อ',
        confirm: 'ยืนยันการส่งคำตอบ',
        cancel: 'ยกเลิก',
        stopExam: 'หยุดทำข้อสอบ',
        stopExamWarning: 'คุณต้องการยกเลิกการทำข้อสอบหรือไม่ ข้อมูลข้อสอบชุดนี้จะถูกบันทึกว่า "ไม่ได้ทำการส่งข้อสอบ"',
    },
    en: {
        m: 'M.',
        hour: 'Hours',
        minute: 'Minutes',
        notYetTime: 'Has not the time to do the exam',
        overDeadline: 'Overtime',
        chooseExam: 'Choose the Exam',
        classId: 'Class ID',
        room: 'Room',
        teacher: 'Teacher',
        course: 'Course',
        period: 'Period',
        duration: 'Duration',
        startQuiz: 'Start the exam',
        noExam: 'No available exam',
        questionAmount: "Question's Amount",
        welcome: 'Welcome',
        countdown: 'Remaining time',
        questionDiagram: 'Question Diagram',
        current: 'Current',
        selected: 'Selected',
        notSelected: 'Not Selected',
        submit: 'Submit',
        question: 'Question',
        from: 'From',
        back: 'Back',
        forward: 'Forward',
        confirmSubmit: 'Do you want to submit the answer sheet ?',
        notFinish: 'You are not complete the exam',
        confirm: 'Confirm',
        cancel: 'Cancel',
        stopExam: 'Stop doing the exam',
        stopExamWarning: 'Do you want to stop doing the exam? This answer sheet will be saved with "Do not submit the exam"',
    }
}

class CodeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

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
            answersheet: null,
            isSendingAnswer: false,
            isLoading: true,
            quitConfirmed: false,
            focusExam: null
        }
    }

    componentDidMount() {
        let _this = this
        window.addEventListener("beforeunload", (e) => this.onUnload(e, _this))
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function (e) {
            console.log('e', e)
            console.log('isStart', _this.state.isStart)
            if (_this.state.isStart) {
                _this.setState({ quizModal: true, quitConfirmed: true })
                window.history.go(1)
            }
            else if (_this.state.pickedQuiz && !_this.state.start) {
                window.sideNav = false
                _this.setState({ pickedQuiz: false })
                window.history.go(1)
            }
            else {
                // window.sideNav = false
                // _this.forceUpdate()
            }
        };
        fetch('http://student.questionquick.com/course',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(qstn => {
                console.log('qstn', qstn)
                if (qstn.message === 'Not Login') {
                    fetch('http://student.questionquick.com/session/',
                        {
                            credentials: 'include',
                            //headers: { 'Content-Type': 'application/json' },
                            method: 'DELETE',
                        })
                        .then(res => res.json())
                        .then(e => {
                            if (e.code === '401') {
                                throw new CodeError(e.message, e.code);
                            }
                            else {
                                this.setState({ isLoading: false, redirectHome: true })
                                console.log(e)
                            }

                        })
                        .catch(err => {
                            this.setState({ isLoading: false }, () => /*alert(err.message)*/null)
                            console.log('error', err)
                        })
                }
                else {
                    fetch('http://student.questionquick.com/session/',
                        {
                            credentials: 'include',
                        })
                        .then(res => res.json())
                        .then(e => {
                            if (e.code === '401') {
                                throw new CodeError(e.message, e.code);
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
        if (_this.state.isStart && !_this.state.quitConfirmed) {
            event.preventDefault();
            event.returnValue = '';
        }
    }

    componentWillUnmount() {
        // window.removeEventListener("beforeunload", this.onUnload)
    }

    start() {
        console.log(this.state.pickedQuiz, this.state.pickedQuizData)

        // //for test only
        // this.setState({ isStart: true, isLoading: false, startExamModal: false, /*answersheet: e*/ }, () => {
        //     this.clockCall = setInterval(() => {
        //         this.decrementClock();
        //     }, 1000);
        // })
        // //for test only

        this.setState({ isLoading: true }, () => {
            fetch('http://student.questionquick.com/quiz/',
                {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({ 'qeid': this.state.pickedQuizData.qeid })
                })
                .then(res => Promise.all([res, res.json()]))
                .then(resp => {
                    // console.log(resp)
                    let response = resp[0]
                    let e = resp[1]

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
                        this.setState({ isStart: true, isLoading: false, startExamModal: false, answersheet: e }, () => {
                            this.clockCall = setInterval(() => {
                                this.decrementClock();
                            }, 1000);
                        })
                    }

                    //test
                    // this.setState({ isStart: true, isLoading: false, startExamModal: false, answersheet: e }, () => {
                    //     this.clockCall = setInterval(() => {
                    //         this.decrementClock();
                    //     }, 1000);
                    // })
                })
                .catch(err => {
                    this.setState({ isLoading: false }, () => alert(err.message))
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

    getTimerBG() {
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
        console.log(window.sideNav)
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

    getRoomListTxt(grade, rooms) {
        let txt = ''
        for (let i in rooms) {
            txt += (word[window.language].m + grade + '/' + rooms[i] + ', ')
        }
        return txt.slice(0, -2)
    }

    getMedia(media, isQuestion) {
        if (media.type === 'image') {
            let imageBox = { marginBottom: isQuestion ? 20 : 0, marginTop: isQuestion ? 0 : 10 }
            let imageStyle = { height: isQuestion ? '30vh' : 'auto', width: isQuestion ? 'auto' : '18vw', borderRadius: 7 }
            return <div style={imageBox}>
                <img src={'http://dev.hatyaiapp.com:11948' + media.path} alt={''} style={imageStyle} />
            </div>
        }
        else if (media.type === 'video') {
            let videoBox = { width: isQuestion ? '23vw' : '18vw', marginBottom: isQuestion ? 20 : 0, margin: 'auto', marginTop: isQuestion ? 0 : 10, borderRadius: 7, overflow: 'hidden' }
            let videoStyle = { width: isQuestion ? '23vw' : '18vw', }
            return <div style={videoBox}>
                <Player
                    controls
                    fluid
                    style={videoStyle}
                    width={isQuestion ? '23vw' : '18vw'}
                    height={'30vw'}
                    poster={'http://dev.hatyaiapp.com:11948' + media.path.replace('mp4', 'png')}
                    src={'http://dev.hatyaiapp.com:11948' + media.path}
                />
            </div>
        }
        else if (media.type === 'audio') {
            let audioBox = { width: isQuestion ? '30vw' : '18vw', marginBottom: isQuestion ? 20 : 0, margin: 'auto', marginTop: isQuestion ? 0 : 10 }
            let audioStyle = { width: '100%' }
            return <div style={audioBox}>
                <ReactAudioPlayer
                    style={audioStyle}
                    src={'http://dev.hatyaiapp.com:11948' + media.path}
                    autoPlay={false}
                    controls
                    controlsList="nodownload"
                />
            </div>
        }
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
            txt += h + ' ' + word[window.language].hour + ' ';
        }
        if (m !== 0) {
            txt += m + ' ' + word[window.language].minute
        }
        return txt
    }

    isAvailable(start, end) {
        let now = Date.now()
        return now > Date.parse(start) && now < Date.parse(end)
    }

    pickExam() {
        let arrIndex1 = this.state.event.slice(0, this.state.event.indexOf('_'))
        let arrIndex2 = this.state.event.slice(this.state.event.indexOf('_') + 1)

        let item = this.state.qstn[arrIndex1]
        let data = this.state.qstn[arrIndex1].quizevents[arrIndex2]
        console.log(item, data, arrIndex1, arrIndex2)
        this.setState({ isLoading: true, startExamModal: true }, () => {
            fetch('http://student.questionquick.com/exam/' + data.exam + '/questions',
                {
                    credentials: 'include',
                })
                .then(res => res.json())
                .then(exam => {
                    console.log('exam data', exam, data, item)
                    this.setState({ /*: false,*/ exam, pickedQuiz: item, pickedQuizData: data, fullTimer: data.duration, timer: data.duration * 60 })
                })
                .catch(e => {
                    console.log(e)
                    //this.setState({ isLoading: false })
                    this.setState({ isLoading: false })
                })
        })
    }

    submit() {
        console.log(this.state.answer, this.state.answersheet)
        let _this = this
        let answer = Object.keys(_this.state.answer).map(function (key) {
            return _this.state.answer[key]
        });
        console.log(answer)

        this.setState({ isSendingAnswer: true }, () => {
            fetch('http://student.questionquick.com/quiz/' + this.state.answersheet._id, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify({
                    answers: answer
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
            return ''
        }
        else {
            let now = Date.now()
            if (now < Date.parse(start)) {
                return ' (' + word[window.language].notYetTime + ')'
            }
            else if (now > Date.parse(end)) {
                return ' (' + word[window.language].overDeadline + ')'
            }
        }
    }

    toggleDetail(id) {
        if (this.state.detailPicked === id) {
            this.setState({ detailPicked: null })
        }
        else {
            this.setState({ detailPicked: id })
        }
    }

    chooseQuiz() {
        return (
            <div style={styles.chooseQuizContainer}>
                <p style={styles.chooseQuizTopic}>{word[window.language].chooseExam}</p>
                <div style={styles.cutLine} />
                {this.state.isLoading ?
                    <div style={styles.answerContainerFullfill}>
                        <Spinner type="grow" color="warning" style={styles.sendingAnswerLoading} />
                    </div>
                    :
                    this.state.qstn.length > 0 ?
                        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <div style={styles.chooseQuizDataBox}>
                                {this.state.qstn.map((item, index) => {
                                    let titleColor = index % 2 === '1' ? '#F0592B' : '#FAAE3C'
                                    return (
                                        <div key={index} style={styles.quizBox}>
                                            <div style={{ ...styles.quizTitleContainer, borderColor: titleColor }}>
                                                <div onClick={() => this.toggleDetail("#detail" + index)} style={{ ...styles.quizTitleBox, backgroundColor: titleColor, cursor: 'pointer' }}>
                                                    <p style={styles.quizTitle}>{item.title}</p>
                                                    <FontAwesomeIcon icon={this.state.detailPicked === ("#detail" + index) ? faEye : faEyeSlash} style={styles.quizTitleIco} />
                                                </div>
                                                <Collapse style={styles.quizDescBox} isOpen={this.state.detailPicked === "#detail" + index}>
                                                    <div style={styles.quizDesc1}>
                                                        <p style={styles.quizDescTxt}><span style={styles.quizDescTopic}>{word[window.language].classId}:</span> {item.code}</p>
                                                        <p style={styles.quizDescTxt}><span style={styles.quizDescTopic}>{word[window.language].room}:</span> {this.getRoomListTxt(item.grade, item.rooms)}</p>
                                                    </div>
                                                    <div style={styles.quizDesc2}>
                                                        <p style={styles.quizDescTxt}><span style={styles.quizDescTopic}>{word[window.language].teacher}:</span> {item.teacher && item.teacher.name}</p>
                                                        <p style={styles.quizDescTxt}><span style={styles.quizDescTopic}>{word[window.language].course}:</span> {subjectCode.find(sc => { return item.subjectCode === sc.code })[window.language]}</p>
                                                    </div>
                                                </Collapse>
                                            </div>
                                            <div style={styles.quizDesc3}>
                                                {item.quizevents.map((quiz, i) => {
                                                    return (
                                                        <Button key={i} style={styles.quizeventsContainer} color={'link'} onClick={() => this.setState({ event: index + '_' + i, focusExam: this.getOutOfTimeTxt(quiz.start, quiz.end) })}>
                                                            <CustomInput type="radio" id={index + '_' + i} name="customRadio" checked={index + '_' + i === this.state.event} onChange={() => null} />
                                                            <div style={styles.quizeventsContainerInner}>
                                                                <div style={styles.quizeventsBox}>
                                                                    <p style={styles.quizDescTxt2}>{'[ ข้อสอบชุดที่ X XXXXXXXXXXXXXXXX ]'}</p>
                                                                    {<p style={{ ...styles.quizDescTxt, color: '#ccc', fontSize: '24px' }}>{this.getOutOfTimeTxt(quiz.start, quiz.end)}</p>}
                                                                </div>
                                                                <div style={styles.quizeventsBox}>
                                                                    <p style={{ ...styles.quizDescTxt2, color: titleColor }}>{word[window.language].period}: {this.getDateTxt(quiz.start)} - {this.getDateTxt(quiz.end)}</p>
                                                                    <p style={{ ...styles.quizDescTxt, color: titleColor }}>{word[window.language].duration}: {this.getDurationTxt(quiz.duration)}</p>
                                                                    {/* <Button onClick={() => this.pickExam(quiz.exam, quiz, item)} disabled={!this.isAvailable(quiz.start, quiz.end)} color={this.isAvailable(quiz.start, quiz.end) ? 'success' : 'secondary'} style={styles.pickQuizBtn}>
                                                                        <p style={styles.startQuizTxt}>{word[window.language].startQuiz}</p>
                                                                    </Button> */}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={styles.cutLine} />
                            {this.getStartQuizBtn()}
                        </div>
                        :
                        <p style={styles.text}>
                            {word[window.language].noExam}
                        </p>
                }
            </div>
        )
    }

    quizDetail() {
        return (
            <div style={styles.quizDetailContainer}>
                <span style={styles.quizDetailTxt1}>{this.state.pickedQuiz.title}</span>
                <span style={styles.quizDetailTxt2}>({this.state.pickedQuiz.code})</span>
                <span style={styles.quizDetailTxt3}><span style={styles.quizDetailTopic1}>{word[window.language].teacher}: </span>{this.state.pickedQuiz.teacher.name}</span>
                <div style={styles.quizDetailDescBox}>
                    <span style={styles.quizDetailTxt4}>{word[window.language].questionAmount}: <span style={styles.quizDetailTopic2}>{this.state.exam.length}</span></span>
                    <span style={styles.quizDetailTxt4}>{word[window.language].duration}: <span style={styles.quizDetailTopic2}>{this.getDurationTxt(this.state.pickedQuizData.duration)}</span></span>
                </div>
                <Button onClick={() => this.start()} style={styles.startQuizBtn}>
                    <span style={styles.startQuizBtnTxt}>{word[window.language].startQuiz}</span>
                    <FontAwesomeIcon icon={faCaretRight} style={styles.startQuizBtnIco} />
                </Button>

                <Button onClick={() => this.setState({ exam: null, pickedQuiz: null, pickedQuizData: null, fullTimer: 0, timer: 0 })} style={styles.backPickQuizBtn}>
                    <span style={styles.backPickQuizBtnTxt}>{word[window.language].chooseExam}</span>
                    <FontAwesomeIcon icon={faCaretRight} style={styles.backPickQuizBtnIco} />
                </Button>
            </div>
        )
    }

    quiz() {
        return (
            <div style={styles.quizContainer}>
                <div style={styles.quizBox1}>
                    <div style={styles.quizBox1_1}>
                        <p style={styles.quizBox1_1Topic}>{word[window.language].welcome}</p>
                        <div style={styles.quizBox1_1Box}>
                            <div style={styles.quizBox1_1DetailBox}>
                                <FontAwesomeIcon icon={faUser} style={styles.quizBox1_1DetailIco} />
                                <span style={styles.quizBox1_1DetailTxt}>: {this.state.user.name}</span>
                            </div>
                            <div style={styles.quizBox1_1DetailBox}>
                                <FontAwesomeIcon icon={faClock} style={styles.quizBox1_1DetailIco} />
                                <span style={styles.quizBox1_1DetailTxt}>: {this.getDurationTxt(this.state.fullTimer)}</span>
                            </div>
                            <div style={styles.quizBox1_1DetailBox}>
                                <FontAwesomeIcon icon={faFileAlt} style={styles.quizBox1_1DetailIco} />
                                <span style={styles.quizBox1_1DetailTxt}>: {this.state.pickedQuiz.title}</span>
                            </div>
                        </div>
                    </div>
                    <div style={styles.quizBox1_2}>
                        <div style={{ ...styles.quizBox1_2Box, backgroundColor: this.getTimerBG() }}>
                            <span style={styles.countDownTopic}>{word[window.language].countdown}</span>
                            <span style={styles.countDownText}>{this.state.isTimeOut ? 'Times Up!' : this.getTimeTxt(this.state.timer)}</span>
                        </div>
                    </div>
                    <div style={styles.quizBox1_3}>
                        <div style={styles.examTopicBox}>
                            <div style={styles.icoBox} />
                            <p style={styles.diagramTopicTxt}><FontAwesomeIcon icon={faCalendarAlt} style={styles.icoBox} />{word[window.language].questionDiagram}</p>
                            <FontAwesomeIcon id="toggler" icon={faInfoCircle} style={styles.diagramTopicIco} />
                        </div>
                        <div style={styles.diagramContainer}>
                            <span style={styles.diagramProgress}>{this.getProgress()}</span>
                            <div style={styles.diagramBox}>
                                <div style={styles.diagramBoxInner}>
                                    {this.state.exam.map((d, index) => {
                                        let diagramBtn = { width: '1.5vw', height: '1.5vw', border: this.state.current === index ? '2px solid #337ab7' : '2px solid transparent', backgroundColor: this.state.answer[index] !== undefined ? '#44b29c' : '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0 }
                                        return (
                                            <Button key={index} onClick={() => this.setState({ current: index })} style={diagramBtn}>
                                                <p style={styles.diagramTxt}>{index + 1}</p>
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                            <UncontrolledCollapse toggler="#toggler">
                                <div style={styles.diagramDescContainer}>
                                    <div style={styles.diagramDescBox}>
                                        <div style={styles.diagramDescBtn1} />
                                        <span style={styles.diagramDescBtnTxt}>{word[window.language].current}</span>
                                    </div>
                                    <div style={styles.diagramDescBox}>
                                        <div style={styles.diagramDescBtn2} />
                                        <span style={styles.diagramDescBtnTxt}>{word[window.language].selected}</span>
                                    </div>
                                    <div style={styles.diagramDescBox}>
                                        <div style={styles.diagramDescBtn3} />
                                        <span style={styles.diagramDescBtnTxt}>{word[window.language].notSelected}</span>
                                    </div>
                                </div>
                            </UncontrolledCollapse>
                        </div>
                    </div>
                    <div style={styles.quizBox1_4}>
                        {!this.isFinish() ?
                            <Button onClick={() => this.setState({ modal: true })} style={styles.finishBtn1}>
                                <span style={styles.finishBtnTxt1}>{word[window.language].submit}</span>
                                <FontAwesomeIcon icon={faCaretRight} style={styles.finishBtnIco1} />
                            </Button>
                            :
                            <Button onClick={() => this.setState({ modal: true })} style={styles.finishBtn2}>
                                <span style={styles.finishBtnTxt2}>{word[window.language].submit}</span>
                                <FontAwesomeIcon icon={faCaretRight} style={styles.finishBtnIco2} />
                            </Button>
                        }
                    </div>
                </div>
                <div style={styles.quizBox2}>
                    <div style={styles.examTopicContainer}>
                        <h1 style={styles.examTopicTxt}>{word[window.language].question} {this.state.current + 1} {word[window.language].from} {this.state.exam.length}</h1>
                        <div style={styles.examRouter}>
                            {this.state.current > 0 ?
                                <Button onClick={() => this.setState({ current: this.state.current - 1 })} style={styles.routerBtn}>
                                    <FontAwesomeIcon icon={faCaretLeft} style={styles.routerBtnIco} />
                                    <span style={styles.routerBtnTxt}>{word[window.language].back}</span>
                                </Button>
                                :
                                <Button disabled onClick={() => null} style={styles.routerBtnDisable}>
                                    <FontAwesomeIcon icon={faCaretLeft} style={styles.routerBtnIco} />
                                    <span style={styles.routerBtnTxt}>{word[window.language].back}</span>
                                </Button>
                            }
                            {this.state.current !== (this.state.exam.length - 1) ?
                                <Button onClick={() => this.setState({ current: this.state.current + 1 })} style={styles.routerBtn}>
                                    <span style={styles.routerBtnTxt}>{word[window.language].forward}</span>
                                    <FontAwesomeIcon icon={faCaretRight} style={styles.routerBtnIco} />
                                </Button>
                                :
                                <Button disabled onClick={() => null} style={styles.routerBtnDisable}>
                                    <span style={styles.routerBtnTxt}>{word[window.language].forward}</span>
                                    <FontAwesomeIcon icon={faCaretRight} style={styles.routerBtnIco} />
                                </Button>
                            }
                        </div>
                    </div>

                    <div style={styles.examContainer}>
                        <div style={styles.examContainerInner}>
                            <span style={styles.question}>
                                {this.state.exam[this.state.current] && this.state.exam[this.state.current].text}
                            </span>
                            <div >
                                {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                                    this.getMedia(this.state.exam[this.state.current].media, true)
                                }
                            </div>
                            <div style={styles.answerContainer}>
                                {this.state.exam[this.state.current] && this.state.exam[this.state.current].choices.map((c, index) => {
                                    let timeoutOpacity = this.state.isTimeOut ? 0.5 : 1
                                    let btnStyle = { width: '97%', backgroundColor: JSON.stringify(this.state.answer[this.state.current]) === JSON.stringify({ "qid": this.state.exam[this.state.current].qid, "cid": c.cid }) ? '#2abaf0' : '#fff', border: '2px solid #2abaf0', padding: 0, borderRadius: 30, marginTop: 10 }
                                    return (
                                        <div key={index} style={{ ...styles.answerBtnContainer, opacity: timeoutOpacity }}>
                                            <div style={styles.answerContainerInner}>
                                                <Button
                                                    onClick={() => {
                                                        if (JSON.stringify(this.state.answer[this.state.current]) === JSON.stringify({ "qid": this.state.exam[this.state.current].qid, "cid": c.cid })) {
                                                            this.setState({ answer: { ...this.state.answer, [this.state.current]: undefined } })
                                                        }
                                                        else {
                                                            this.setState({ answer: { ...this.state.answer, [this.state.current]: { "qid": this.state.exam[this.state.current].qid, "cid": c.cid } } })
                                                            // if (this.state.current < this.state.exam.length - 1) {
                                                            //     this.setState({ current: this.state.current + 1 })
                                                            // }
                                                            // else {
                                                            //     this.forceUpdate()
                                                            // }
                                                        }
                                                    }}
                                                    disabled={this.state.isTimeOut}
                                                    style={btnStyle}
                                                >
                                                    <span style={styles.answerTxt}>{c.text}</span>
                                                </Button>
                                                {c.media && this.getMedia(c.media, false)}
                                            </div>
                                            <div style={styles.answerContainerFullfill} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.modal} toggle={() => this.setState({ modal: this.state.isSendingAnswer ? true : !this.state.modal })} className={this.props.className}>
                    <ModalBody>
                        {this.state.isSendingAnswer ?
                            <Spinner type="grow" color="warning" style={styles.sendingAnswerLoading} />
                            :
                            this.isFinish() ?
                                <p style={styles.sendingAnswerTxt}>{word[window.language].confirmSubmit}</p>
                                :
                                <div>
                                    <p style={styles.sendingAnswerTxt}>{word[window.language].confirmSubmit}</p>
                                    <p style={styles.sendingAnswerWarning}>
                                        <FontAwesomeIcon icon={faExclamationCircle} style={styles.sendingAnswerWarningIco} />
                                        {word[window.language].notFinish}
                                    </p>
                                </div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={this.state.isSendingAnswer} onClick={() => this.submit()} style={styles.sendAnswerBtnConfirm}>
                            <span style={styles.sendAnswerBtnTxt}>{word[window.language].confirm}</span>
                        </Button>
                        <Button disabled={this.state.isSendingAnswer} onClick={() => this.setState({ modal: false })} style={styles.sendAnswerBtnCancel}>
                            <span style={styles.sendAnswerBtnTxt}>{word[window.language].cancel}</span>
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    stopQuizModal() {
        return (
            <Modal isOpen={this.state.quizModal} toggle={() => this.setState({ quizModal: false })}>
                <ModalHeader toggle={() => this.setState({ quizModal: false }, () => alert(word[window.language].stopExam))}>{word[window.language].stopExam} ?</ModalHeader>
                <ModalBody>
                    {word[global.language].stopExamWarning}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => this.setState({ quizModal: false }, () => window.history.go(0))}>{word[window.language].stopExam}</Button>{' '}
                    <Button color="secondary" onClick={() => this.setState({ quizModal: false, isStart: true, quitConfirmed: false })}>{word[window.language].cancel}</Button>
                </ModalFooter>
            </Modal>
        )
    }

    startExamModal() {
        if (!this.state.pickedQuiz) {
            return null
        }
        return (
            <Modal isOpen={this.state.startExamModal} toggle={() => this.setState({ startExamModal: false, isLoading: false })}>
                <ModalHeader toggle={() => this.setState({ startExamModal: false, isLoading: false })}>
                    <span style={styles.quizDetailTxt1}>{this.state.pickedQuiz.title}</span>
                </ModalHeader>
                <ModalBody>
                    <p style={styles.quizDetailTxt2}>({this.state.pickedQuiz.code})</p>
                    <span style={styles.quizDetailTxt3}><span style={styles.quizDetailTopic1}>{word[window.language].teacher}: </span>{this.state.pickedQuiz.teacher.name}</span>
                    <div style={styles.quizDetailDescBox}>
                        <span style={styles.quizDetailTxt4}>{word[window.language].questionAmount}: <span style={styles.quizDetailTopic2}>{this.state.exam.length}</span></span>
                        <span style={styles.quizDetailTxt4}>{word[window.language].duration}: <span style={styles.quizDetailTopic2}>{this.getDurationTxt(this.state.pickedQuizData.duration)}</span></span>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* <Button onClick={() => this.start()} style={styles.startQuizBtn}>
                        <span style={styles.startQuizBtnTxt}>{word[window.language].startQuiz}</span>
                        <FontAwesomeIcon icon={faCaretRight} style={styles.startQuizBtnIco} />
                    </Button>

                    <Button onClick={() => this.setState({ exam: null, pickedQuiz: null, pickedQuizData: null, fullTimer: 0, timer: 0 })} style={styles.backPickQuizBtn}>
                        <span style={styles.backPickQuizBtnTxt}>{word[window.language].chooseExam}</span>
                        <FontAwesomeIcon icon={faCaretRight} style={styles.backPickQuizBtnIco} />
                    </Button> */}
                    <Button style={styles.startQuizBtn} onClick={() => this.start()}>
                        <span style={styles.startQuizBtnTxt}>{word[window.language].startQuiz}</span>
                    </Button>
                    {' '}
                    <Button style={styles.backPickQuizBtn} onClick={() => this.setState({ startExamModal: false, isLoading: false })}>
                        <span style={styles.backPickQuizBtnTxt}>{word[window.language].chooseExam}</span>
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    getStartQuizBtn() {
        if (this.state.focusExam === '') {
            return (
                <Button onClick={() => this.pickExam()} style={styles.startMainQuizBtn}>
                    <span style={styles.startMainQuizBtnTxt}>{word[window.language].startQuiz}</span>
                    <FontAwesomeIcon icon={faCaretRight} style={styles.startMainQuizBtnIco} />
                </Button>
            )
        }
        else if (!this.state.focusExam) {
            return (
                <Button disabled={true} style={styles.startMainQuizBtnDisable}>
                    <span style={styles.startMainQuizBtnTxt}>{word[window.language].startQuiz}</span>
                    <FontAwesomeIcon icon={faCaretRight} style={styles.startMainQuizBtnIco} />
                </Button>
            )
        }
        else {
            return (
                <Button disabled={true} style={{ ...styles.startMainQuizBtnDisable }}>
                    <span style={{ ...styles.startMainQuizBtnTxt }}>{this.state.focusExam}</span>
                    <FontAwesomeIcon icon={faCaretRight} style={{ ...styles.startMainQuizBtnIco }} />
                </Button>
            )
        }
    }

    render() {
        if (this.state.redirectHome) {
            return <Redirect push to="/" />;
        }

        return (
            <div className="login loginContainer">
                <SideNav page={'home'} />
                {this.state.isLoading &&
                    <div style={styles.loadingContainer}>
                        <Spinner type="grow" color="warning" style={styles.loading} />
                    </div>
                }
                <div className='quizBox'>
                    {/* {!this.state.pickedQuiz ?
                        this.chooseQuiz()
                        :
                        !this.state.isStart ?
                            this.quizDetail()
                            :
                            this.quiz()
                    } */}

                    {!this.state.pickedQuiz || !this.state.isStart ?
                        this.chooseQuiz()
                        :
                        this.quiz()
                    }
                    <img src={require('../image/decorate02.png')} style={styles.decorateLeft} alt={'decorate02'} />
                    <img src={require('../image/decorate01.png')} style={styles.decorateRight} alt={'decorate01'} />
                </div>

                {this.stopQuizModal()}
                {this.startExamModal()}
            </div>
        );
    }
}

const styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    loading: { width: '3rem', height: '3rem' },
    quizTitleContainer: { borderWidth: 5, borderStyle: 'solid', borderRadius: '20px', overflow: 'hidden' },
    quizTitleBox: { overflow: 'hidden', justifyContent: 'center', alignItems: 'center', width: '100%', borderWidth: 0, flexDirection: 'row', display: 'flex' },
    quizBox: { borderRadius: 10, /*borderWidth: 5, borderStyle: 'solid', borderColor: '#2abaf0', */width: '95%', padding: '5px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', },
    quizeventsContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, width: '100%', backgroundColor: 'transparent', borderWidth: 0, textDecoration: 'none' },
    quizeventsContainerInner: { display: 'flex', flexDirection: 'column', flex: 1 },
    quizeventsBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 },
    cutLine: { width: '100%', height: 1, backgroundColor: '#ccc' },
    outOffTimeTxt: { color: 'red', fontSize: '24px', fontFamily: 'DBH' },
    text: { color: '#000', fontFamily: 'DBH', fontSize: '24px' },

    chooseQuizContainer: { zIndex: 2, width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column' },
    chooseQuizTopic: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px', alignSelf: 'flex-start', margin: 0, marginLeft: 30 },
    chooseQuizDataBox: { display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'scroll' },
    quizTitle: { color: '#000', fontFamily: 'DBH', fontSize: '30px', margin: 5 },
    quizTitleIco: { width: '24px', fontSize: '24px', color: '#000' },
    quizDesc1: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 },
    quizDesc2: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
    quizDesc3: { marginTop: 0 },
    quizDescBox: { paddingLeft: 5, paddingRight: 5 },
    quizDescTxt: { color: '#555', fontFamily: 'DBH', fontSize: '30px', margin: 0 },
    quizDescTxt2: { color: '#1c527c', fontFamily: 'DBH', fontSize: '30px', margin: 0, width: '40vw', textAlign: 'left' },
    quizDescTopic: { color: '#999' },
    pickQuizBtn: { height: 40, paddingTop: 0, paddingBottom: 0 },
    startQuizTxt: { color: '#fff', fontFamily: 'DBH', fontSize: '24px', margin: 0 },

    quizDetailContainer: { zIndex: 2, width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    quizDetailTxt1: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px' },
    quizDetailTxt2: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '30px' },
    quizDetailTxt3: { color: '#7fd642', fontFamily: 'DBH', fontSize: '30px' },
    quizDetailTxt4: { color: '#555', fontFamily: 'DBH', fontSize: '30px' },
    quizDetailDescBox: { marginTop: 20, display: 'flex', flexDirection: 'column' },
    quizDetailTopic1: { color: '#555' },
    quizDetailTopic2: { color: '#337ab7', fontFamily: 'DBH', fontSize: '30px' },
    startMainQuizBtn: { width: '30vw', height: '60px', background: '#f1683e', borderWidth: 0, padding: 0, borderRadius: '2vw', margin: 10, alignSelf: "center" },
    startMainQuizBtnTxt: { fontFamily: 'DBH', color: '#fff', fontWeight: 'bolder', fontSize: '34px' },
    startMainQuizBtnIco: { width: '2vw', fontSize: '24px', color: '#fff' },
    startMainQuizBtnDisable: { width: '30vw', height: '60px', background: '#ccc', borderWidth: 0, padding: 0, borderRadius: '2vw', margin: 10, alignSelf: "center" },
    startQuizBtn: { width: '130px', height: '35px', background: '#f1683e', borderWidth: 2, padding: 0, borderRadius: '2vw', alignSelf: "center", borderColor: '#f1683e', borderStyle: 'solid', },
    startQuizBtnTxt: { fontFamily: 'DBH', color: '#fff', fontWeight: 'bolder', fontSize: '24px' },
    startQuizBtnIco: { width: '2vw', fontSize: '24px', color: '#fff' },
    backPickQuizBtn: { width: '130px', height: '35px', borderColor: '#aaa', borderStyle: 'solid', backgroundColor: '#fff', borderWidth: 2, padding: 0, borderRadius: '2vw', alignSelf: "center" },
    backPickQuizBtnTxt: { fontFamily: 'DBH', color: '#aaa', fontWeight: 'bolder', fontSize: '24px' },
    backPickQuizBtnIco: { width: '2vw', fontSize: '24px', color: '#aaa' },

    quizContainer: { zIndex: 2, width: '85vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'row' },
    quizBox1: { display: 'flex', flex: 1, flexDirection: 'column' },
    quizBox1_1: { display: 'flex', flexDirection: 'column', backgroundColor: '#98def8', marginBottom: 10, marginTop: 10, marginLeft: 10, border: '2px solid #23b8f0', borderRadius: 10, overflow: 'hidden' },
    quizBox1_1Topic: { fontFamily: 'DBH', color: '#1c5379', alignSelf: 'center', fontSize: '24px', flex: 1, fontWeight: 500, margin: 0 },
    quizBox1_1Box: { backgroundColor: '#fff' },
    quizBox1_1DetailBox: { display: 'flex', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis' },
    quizBox1_1DetailIco: { width: '1.6vw' },
    quizBox1_1DetailTxt: { fontFamily: 'DBH', fontWeight: 500, fontSize: '24px' },
    quizBox1_2: { display: 'flex', flexDirection: 'column', backgroundColor: '#fff', marginBottom: 10, marginLeft: 10, border: '2px solid #44b29c', borderRadius: 10, overflow: 'hidden' },
    quizBox1_2Box: { display: 'flex', flexDirection: 'column', alignSelf: 'center', paddingLeft: 25, paddingRight: 25, margin: 5, borderRadius: 10, width: '95%' },
    countDownTopic: { fontFamily: 'DBH', fontWeight: 500, fontSize: '24px', color: '#1c5379' },
    countDownText: { fontFamily: 'DBH', fontWeight: "bold", fontSize: '34px', color: '#1c5379', marginTop: -10 },
    quizBox1_3: { display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff29e', marginBottom: 10, marginLeft: 10, border: '2px solid #ffeb67', borderRadius: 10, overflow: 'hidden' },
    examTopicBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    diagramTopicTxt: { fontFamily: 'DBH', color: '#1c5379', alignSelf: 'center', fontSize: '24px', margin: 0, fontWeight: 500 },
    icoBox: { width: 30 },
    diagramTopicIco: { width: 30, color: '#1c5379' },
    diagramContainer: { backgroundColor: '#fff', flex: 1, display: 'flex', flexDirection: 'column' },
    diagramProgress: { fontFamily: 'DBH', fontWeight: 500, fontSize: '24px', borderBottom: '2px solid #ffeb67' },
    diagramBox: { display: 'flex', flex: 1, overflowY: 'scroll', },
    diagramBoxInner: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-start' },
    diagramTxt: { fontSize: '24px', fontFamily: 'DBH', fontWeight: 500, color: '#000', marginTop: -5 },
    diagramDescContainer: { backgroundColor: '#fff29e', borderTop: '2px solid #ffeb67' },
    diagramDescBox: { display: 'flex', alignItems: 'center' },
    diagramDescBtn1: { width: '1.5vw', height: '1.5vw', border: '2px solid #337ab7', backgroundColor: '#fff', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn2: { width: '1.5vw', height: '1.5vw', backgroundColor: '#44b29c', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn3: { width: '1.5vw', height: '1.5vw', backgroundColor: '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtnTxt: { fontFamily: 'DBH', fontSize: '20px', fontWeight: '500', marginTop: 5 },
    quizBox1_4: { alignSelf: 'center', marginBottom: 10, marginLeft: 10, width: '95%' },
    finishBtn1: { width: '100%', background: '#ffe00f', marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, marginRight: 10 },
    finishBtn2: { width: '100%', background: '#6ebb1f', marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, marginRight: 10 },
    finishBtnTxt1: { fontFamily: 'DBH', fontWeight: 500, color: '#000', fontSize: '30px' },
    finishBtnTxt2: { fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '30px' },
    finishBtnIco1: { width: '1.75vw', fontSize: '24px', color: '#000' },
    finishBtnIco2: { width: '1.75vw', fontSize: '24px', color: '#fff' },
    quizBox2: { display: 'flex', flexDirection: 'column', flex: 4 },
    examTopicContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    examTopicTxt: { fontFamily: 'DBH', fontWeight: 'bolder', color: '#ff5f6d', fontSize: '34px', textAlign: 'left', marginTop: 12, marginLeft: 20 },
    examRouter: { display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
    routerBtn: { width: '12vw', background: '#f1673e', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" },
    routerBtnDisable: { width: '12vw', background: '#aaa', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" },
    routerBtnIco: { width: '1.75vw', fontSize: '24px' },
    routerBtnTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '30px' },
    examContainer: { display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff', margin: 10, marginTop: 0, border: '2px solid #ff5f6d', borderRadius: 10, overflow: 'hidden' },
    examContainerInner: { overflowY: 'scroll', display: 'flex', flex: 1, flexDirection: 'column' },
    question: { fontFamily: 'DBH', fontSize: '30px', fontWeight: 500, textAlign: 'left', marginLeft: 10, marginBottom: 20, color: '#1c5379' },
    answerContainer: { display: 'flex', /*flex: 1,*/ flexWrap: 'wrap', flexDirection: 'row', marginTop: 10 },
    answerBtnContainer: { width: '45%', marginBottom: 20, marginLeft: '2.5%', },
    answerContainerInner: { backgroundColor: '#eee', borderRadius: 30, paddingBottom: 10 },
    answerTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#1c5379', fontSize: '30px' },
    answerContainerFullfill: { display: 'flex', flex: 1 },
    sendingAnswerLoading: { width: '3rem', height: '3rem', margin: 'auto' },
    sendingAnswerTxt: { color: '#1c5379', fontFamily: 'DBH', fontSize: '30px', fontWeight: '500' },
    sendingAnswerWarning: { color: 'red', fontFamily: 'DBH', fontSize: '30px', fontWeight: '500', display: 'flex', flexDirection: 'row', alignItems: 'center' },
    sendingAnswerWarningIco: { width: '30px', fontSize: '1.5vw', marginRight: 5 },
    sendAnswerBtnTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '24px' },
    sendAnswerBtnConfirm: { width: '50%', background: '#00adee', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 },
    sendAnswerBtnCancel: { width: '50%', background: 'red', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 },

    decorateLeft: { bottom: 0, left: 0, position: 'absolute', width: '25vw' },
    decorateRight: { bottom: 0, right: 0, position: 'absolute', width: '25vw' }
}

export default Test;