import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse, Spinner, CustomInput, Collapse, Toast, ToastHeader, ToastBody, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress, Alert } from 'reactstrap';
import { faUser, faClock, faFileAlt, faCalendarAlt, faCaretRight, faCaretLeft, faExclamationCircle, faInfoCircle, faEye, faEyeSlash, faArrowAltCircleRight, faTimes, faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import SideNav from '../_component/sideNav'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
// import Camera from 'react-camera';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import LinesEllipsis from 'react-lines-ellipsis'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

let votingData = [
    { _id: 'QTSHCM', value: 'John', amount: 10 },
    { _id: 'RTJKYC', value: 'Daenerys', amount: 8 },
    { _id: 'ACRGSZ', value: 'Cersei', amount: 2 },
    { _id: 'KOLCXS', value: 'Night King', amount: 14 },
    { _id: 'ERVMJI', value: 'Bran', amount: 28 },
    { _id: 'XFDFXX', value: 'Tyrion', amount: 6 },
    { _id: 'ISDFCVG', value: 'Holdor', amount: 0 },
]

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
        answer: 'คำตอบ',
        article: 'คำถาม',
        onlyPickOne: '* สามารถเลือกคำตอบได้เพียงครั้งเดียวเท่านั้น *',
        notHaveQuestionYet: 'ยังไม่มีคำถามในขณะนี้',
        changeTabWarning: 'คุณได้ทำการเปลี่ยนไปทำงานในเว็บไซต์ หรือโปรแกรมอื่นๆ'
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
        answer: 'Answer',
        article: 'Article',
        onlyPickOne: '* Can choose the answer only once *',
        notHaveQuestionYet: 'There are no questions at this time.',
        changeTabWarning: 'You are change to work on the other website or other programs'
    }
}

var alertTimeout;

let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
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
            focusExam: null,
            toastData: '',
            isFoundVideoRef: false,
            latestVideoIndex: -1,
            matchingDropdownOpenIndex: -1,
            votedId: null,
            questionType: 'normal',
            isVoteSubmited: false
        }
    }

    componentDidMount() {
        let _this = this
        document.addEventListener(visibilityChange, () => this.handleVisibilityChange(this), false);
        window.addEventListener("focus", () => this.onFocus(this))
        window.addEventListener("beforeunload", (e) => this.onUnload(e, _this))
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function (e) {
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

            }
        };
        fetch('http://student.questionquick.com/course',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(qstn => {
                if (qstn.message === 'Not Login') {
                    console.log(qstn)
                    // fetch('http://student.questionquick.com/session/',
                    //     {
                    //         credentials: 'include',
                    //         method: 'DELETE',
                    //     })
                    //     .then(res => res.json())
                    //     .then(e => {
                    //         if (e.code === '401') {
                    //             throw new CodeError(e.message, e.code);
                    //         }
                    //         else {
                    //             this.setState({ isLoading: false, redirectHome: true })
                    //             console.log(e)
                    //         }

                    //     })
                    //     .catch(err => {
                    //         this.setState({ isLoading: false }, () => /*alert(err.message)*/null)
                    //         console.log('error', err)
                    //     })
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
                                        console.log(qstn)
                                        this.setState({ isLoading: false, user, qstn }, () => {
                                            for (let i in qstn) {
                                                for (let j in qstn[i].quizevents) {
                                                    if (qstn[i].quizevents[j].qeid === this.props.ac) {
                                                        this.setState({ event: i + '_' + j, focusExam: this.getOutOfTimeTxt(qstn[i].quizevents[j].start, qstn[i].quizevents[j].end) }, () => {
                                                            this.pickExam()
                                                        })
                                                    }
                                                }
                                            }
                                            // if (this.props.ac && qstn.find(q => { return (q.qeid === this.props.ac) })) {
                                            //     alert('found')
                                            // }
                                            // else {
                                            //     alert('not found')
                                            // }
                                        })
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

    componentWillUnmount() {
        window.removeEventListener("focus", this.onFocus)
        // window.removeEventListener("beforeunload", this.onUnload)
    }

    onUnload(event, _this) {
        if (_this.state.isStart && !_this.state.quitConfirmed) {
            event.preventDefault();
            event.returnValue = '';
        }
    }

    onFocus(_this) {
        if (_this.state.isStart) {
            _this.setState({ toastData: word[window.language].changeTabWarning }, () => {
                // clearTimeout(alertTimeout)
                alertTimeout = setTimeout(function () {
                    _this.setState({ toastData: '' })
                }, 3000);
            })
        }
    }

    handleVisibilityChange(_this) {
        // let alert;
        // if (document[hidden]) {
        //     console.log("change tab")
        //     clearTimeout(alert)
        //     _this.setState({ toastData: 'change tab' }, () => {
        //         alert = setTimeout(function () {
        //             _this.setState({ toastData: '' })
        //         }, 3000);
        //     })
        //     // alert(1)
        //     // this.setState({ actions: [...this.state.actions, 'hide'] });
        // } else {
        //     console.log("back from other tab")
        //     clearTimeout(alert)
        //     _this.setState({ toastData: 'back from other tab' }, () => {
        //         alert = setTimeout(function () {
        //             _this.setState({ toastData: '' })
        //         }, 3000);
        //     })
        //     // alert(2)
        //     // this.setState({ actions: [...this.state.actions, 'show'] });
        // }
    }

    handleVideoStateChange(state, prevState) {
        if (
            this.state.exam.find((e, index) => {
                return (
                    Math.floor(state.currentTime) === e.second &&
                    this.state.latestVideoIndex !== index &&
                    !this.state.answer[index]
                )
            })
        ) {
            this.refs.player.pause();
            if (state.isFullscreen) {
                this.refs.player.toggleFullscreen()
            }
        }

        if (this.state.latestVideoIndex !== -1 && Math.floor(state.currentTime) < this.state.exam[0].second) {
            this.state.latestVideoIndex = -1
        }
        else if (this.state.latestVideoIndex !== (this.state.exam.length - 1) && Math.floor(state.currentTime) >= this.state.exam[this.state.exam.length - 1].second) {
            this.state.latestVideoIndex = this.state.exam.length - 1
        }
        else if (
            this.state.exam.find((e, index) => {
                return (
                    this.state.latestVideoIndex !== index &&
                    Math.floor(state.currentTime) >= this.state.exam[index].second &&
                    Math.floor(state.currentTime) < this.state.exam[index + 1].second
                )
            })
        ) {
            this.state.latestVideoIndex = this.state.exam.findIndex((e, index) => {
                return (
                    this.state.latestVideoIndex !== index &&
                    Math.floor(state.currentTime) >= this.state.exam[index].second &&
                    Math.floor(state.currentTime) < this.state.exam[index + 1].second
                )
            })
        }
    }

    decrementClock = () => {
        this.setState({ timer: this.state.timer - 1 }, () => {
            if (this.state.timer <= 0) {
                this.setState({ isTimeOut: true })
                clearInterval(this.clockCall);
            }
        })
    };

    ////ACTIVE////
    start() {
        // console.log(this.state.pickedQuiz, this.state.pickedQuizData)

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
                        // console.log('e', e)
                        this.setState({ isStart: true, isLoading: false, startExamModal: false, answersheet: e }, () => {
                            this.clockCall = setInterval(() => {
                                this.decrementClock();
                            }, 1000);
                        })
                    }

                    // test
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

    pickExam() {
        let arrIndex1 = this.state.event.slice(0, this.state.event.indexOf('_'))
        let arrIndex2 = this.state.event.slice(this.state.event.indexOf('_') + 1)

        let item = this.state.qstn[arrIndex1]
        let data = this.state.qstn[arrIndex1].quizevents[arrIndex2]
        // console.log(item, data, arrIndex1, arrIndex2)
        this.setState({ isFetchingExam: true, startExamModal: true }, () => {
            if (data.exam) {
                fetch('http://student.questionquick.com/exam/' + data.exam._id + '/questions',
                    {
                        credentials: 'include',
                    })
                    .then(res => res.json())
                    .then(exam => {
                        // console.log('exam data', exam, data, item)
                        this.setState({ /*: false,*/ exam, pickedQuiz: item, pickedQuizData: data, fullTimer: data.duration, timer: data.duration * 60, questionType: data.exam.type })
                    })
                    .catch(e => {
                        console.log(e)
                        //this.setState({ isLoading: false })
                        this.setState({ isFetchingExam: false })
                    })
            }
        })
    }

    submit() {
        console.log(this.state.answer, this.state.answersheet)
        let _this = this
        let answer = Object.keys(_this.state.answer).map(function (key) {
            return _this.state.answer[key]
        });
        console.log(answer)

        if (this.state.answersheet.message) {
            alert(this.state.answersheet.message)
        }
        else {
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
                        if (json.message) {
                            throw new CodeError(json.message, 0);
                        }
                        else {
                            alert('ส่งข้อสอบสำเร็จ')
                            this.setState({ quizModal: false, pickedQuiz: null, pickedQuizData: null, isSendingAnswer: false, modal: false, answer: [], current: 0, isStart: false })
                        }
                    })
                    .catch(err => {
                        alert(err.message)
                        this.setState({ quizModal: false, isSendingAnswer: false })
                        console.log("err", err)
                    })
            })
        }
    }

    videoJumper(i) {
        if (this.refs.player && this.state.exam[i]) {
            this.refs.player.seek(this.state.exam[i].second)
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

    onTakePhoto(dataUri) {
        // Do stuff with the dataUri photo...
        console.log('takePhoto');
    }

    setMatchAnswer(q, a) {
        let question = this.state.exam[this.state.current]
        if (this.state.answer[this.state.current] && this.state.answer[this.state.current].multiChoice) {
            let i = this.state.answer[this.state.current].multiChoice.findIndex(c => {return c.cid === q.cid})
            if(i > -1){
                this.state.answer[this.state.current].multiChoice[i] = { cid: q.cid, pid: a.pid }
            }
            else {
                this.state.answer[this.state.current].multiChoice.push({ cid: q.cid, pid: a.pid })
            }
        }
        else {
            this.state.answer[this.state.current] = { qid: question.qid, multiChoice: [{ cid: q.cid, pid: a.pid }] }
        }
    }
    ////ACTIVE////

    ////GETTER////
    isFinish() {
        for (let i in this.state.exam) {
            if (this.state.answer[i] === undefined || (this.state.exam[i].type === 'match' && this.state.answer[i] && this.state.exam[i].choices.length > this.state.answer[i].multiChoice.length)) {
                return false
            }
        }
        return true
    }

    isAvailable(start, end) {
        let now = Date.now()
        return now > Date.parse(start) && now < Date.parse(end)
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
        else if (this.state.fullTimer * 60 * 0.5 < this.state.timer) {
            return '#b3e0d7'
        }
        else if (this.state.fullTimer * 60 * 0.25 < this.state.timer) {
            return '#f0f190'
        }
        else {
            return '#ffc879'
        }
    }

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

    getRoomListTxt(grade, rooms) {
        let txt = ''
        for (let i in rooms) {
            txt += (word[window.language].m + grade + '/' + rooms[i] + ', ')
        }
        return txt.slice(0, -2)
    }

    getMedia(media, isQuestion) {
        if (media.type === 'image') {
            let imageBox = { marginBottom: isQuestion ? 20 : 10, marginTop: isQuestion ? 0 : 10 }
            let imageStyle = { height: isQuestion ? '30vh' : 'auto', width: isQuestion ? 'auto' : '18vw', borderRadius: 7 }
            return <div style={imageBox}>
                <img src={'http://student.questionquick.com' + media.path} alt={''} style={imageStyle} />
            </div>
        }
        else if (media.type === 'video') {
            let videoBox = { width: isQuestion ? '100%' : '17vw', height: isQuestion ? '45vh' : 'auto', marginBottom: isQuestion ? 20 : 10, margin: 'auto', marginTop: isQuestion ? 0 : 10, borderRadius: 7 }
            // let videoStyle = { width: isQuestion ? '40.8vw' : '17vw', }
            return <div style={videoBox}>
                <Player
                    controls
                    fluid={!isQuestion}
                    // style={videoStyle}
                    width={isQuestion ? '100%' : '17vw'}
                    height={isQuestion ? '100%' : '10vw'}
                    poster={'http://student.questionquick.com' + media.path.replace('mp4', 'png')}
                    src={'http://student.questionquick.com' + media.path}
                />
            </div>
        }
        else if (media.type === 'audio') {
            let audioBox = { width: isQuestion ? '30vw' : '18vw', marginBottom: isQuestion ? 20 : 0, margin: 'auto', marginTop: isQuestion ? 0 : 10 }
            let audioStyle = { width: '100%' }
            return <div style={audioBox}>
                <ReactAudioPlayer
                    style={audioStyle}
                    src={'http://student.questionquick.com' + media.path}
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

    getDefaultColor(i) {
        let color = ['primary', 'secondary', 'success', 'info', 'warning', 'danger']
        return color[i % 6]
    }

    getBarValue(a, data_) {
        // console.log('1082',a, data)
        let data = JSON.parse(JSON.stringify(data_))
        // if(this.state.votedId){
        //     data.find(d => {return d._id === this.state.votedId}).amount += 1
        // }
        let max = Math.max.apply(Math, data.map(function (o) { return o.amount; }))
        return a / max * 100
    }

    getPercentValue(a, data_) {
        let data = JSON.parse(JSON.stringify(data_))
        // if(this.state.votedId){
        //     data.find(d => {return d._id === this.state.votedId}).amount += 1
        // }
        let sum = data.reduce((a, b) => +a + +b.amount, 0);
        return a / sum * 100
    }

    getAnswerData() {
        console.log('vvvvvvvvvvvvvvvvvvvv answer data vvvvvvvvvvvvvvvvvvvv')
        console.log('answer', this.state.answer)
        console.log('answersheet', this.state.answersheet)
        console.log('^^^^^^^^^^^^^^^^^^^^ answer data ^^^^^^^^^^^^^^^^^^^^')
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
    ////GETTER////

    ////VIEW////
    chooseQuiz() {
        return (
            <div style={styles.chooseQuizContainer}>
                <div style={styles.chooseQuizTopicBox}>
                    <p style={styles.chooseQuizTopic}>{word[window.language].chooseExam}</p>
                    {/* <Button style={styles.qrCodeIconButton}>
                        <FontAwesomeIcon icon={faQrcode} style={styles.qrCodeIcon} />
                    </Button> */}
                </div>

                <div style={styles.cutLine} />
                {this.state.isLoading ?
                    <div style={styles.answerContainerFullfill}>
                        <Spinner type="grow" color="warning" style={styles.sendingAnswerLoading} />
                    </div>
                    :
                    this.state.qstn.length > 0 ?
                        <div style={styles.quizBox1}>
                            <div style={styles.chooseQuizDataBox}>
                                {this.state.qstn.map((item, index) => {
                                    let titleColor = index % 2 === 1 ? '#F0592B' : '#FAAE3C'
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
                                                                    <p style={styles.quizDescTxt2}>{quiz && quiz.exam && quiz.exam.title}</p>
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
                                {/* <span style={styles.quizBox1_1DetailTxt}>: {this.state.pickedQuiz.title}</span> */}
                                <span style={styles.quizBox1_1DetailTxt}>: {this.state.pickedQuizData.exam.title}</span>
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
                                        let diagramBtn = {}
                                        if (this.state.questionType === 'normal') {
                                            if (d.type === 'match') {
                                                diagramBtn = { width: '20px', height: '20px', border: this.state.current === index ? '2px solid #337ab7' : '2px solid transparent', backgroundColor: this.state.answer[index] && this.state.answer[index].multiChoice.length === d.choices.length ? '#44b29c' : '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0 }
                                            }
                                            else {
                                                diagramBtn = { width: '20px', height: '20px', border: this.state.current === index ? '2px solid #337ab7' : '2px solid transparent', backgroundColor: this.state.answer[index] !== undefined ? '#44b29c' : '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0 }
                                            }
                                        }
                                        else if (this.state.questionType === 'video') {
                                            diagramBtn = { width: '20px', height: '20px', border: this.state.latestVideoIndex === index ? '2px solid #337ab7' : '2px solid transparent', backgroundColor: this.state.answer[index] !== undefined ? '#44b29c' : '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0 }
                                        }
                                        return (
                                            <Button key={index} onClick={() => { this.state.questionType === 'normal' ? this.setState({ current: index }) : this.videoJumper(index) }} style={diagramBtn}>
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
                        <Button onClick={() => window.history.go(-1)} style={styles.closeExamBtn}>
                            <FontAwesomeIcon icon={faTimes} style={styles.closeExamBtnIco} />
                        </Button>
                        {!this.isFinish() ?
                            <Button onClick={() => this.setState({ modal: true })} style={styles.finishBtn1}>
                                <span style={styles.finishBtnTxt1}>{word[window.language].submit}</span>
                                <FontAwesomeIcon icon={faArrowAltCircleRight} style={styles.finishBtnIco1} />
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
                        <h1 style={styles.examTopicTxt}>{word[window.language].question} {this.state.questionType === 'video' ? this.state.latestVideoIndex + 1 : this.state.current + 1} {word[window.language].from} {this.state.exam.length}</h1>
                        <div style={styles.examRouter}>
                            {(this.state.questionType === 'normal' && this.state.current > 0) || (this.state.questionType === 'video' && this.state.latestVideoIndex > 0) ?
                                <Button onClick={() => { this.state.questionType === 'normal' ? this.setState({ current: this.state.current - 1 }) : this.videoJumper(this.state.latestVideoIndex - 1) }} style={styles.routerBtn}>
                                    <FontAwesomeIcon icon={faCaretLeft} style={styles.routerBtnIco} />
                                    <span style={styles.routerBtnTxt}>{word[window.language].back}</span>
                                </Button>
                                :
                                <Button disabled onClick={() => null} style={styles.routerBtnDisable}>
                                    <FontAwesomeIcon icon={faCaretLeft} style={styles.routerBtnIco} />
                                    <span style={styles.routerBtnTxt}>{word[window.language].back}</span>
                                </Button>
                            }
                            {(this.state.questionType === 'normal' && this.state.current !== (this.state.exam.length - 1)) || (this.state.questionType === 'video' && this.state.latestVideoIndex !== (this.state.exam.length - 1)) ?
                                <Button onClick={() => { this.state.questionType === 'normal' ? this.setState({ current: this.state.current + 1 }) : this.videoJumper(this.state.latestVideoIndex + 1) }} style={styles.routerBtn}>
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

                        {this.state.questionType === 'normal' && this.state.exam[this.state.current] && this.state.exam[this.state.current].choices && this.state.exam[this.state.current].choices.length > 0 && (this.state.exam[this.state.current].type === 'choice' || !this.state.exam[this.state.current].type) ?
                            //choice
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
                            :
                            null
                        }

                        {this.state.questionType === 'normal' && this.state.exam[this.state.current] && this.state.exam[this.state.current].choices && this.state.exam[this.state.current].choices.length === 0 ?
                            //text
                            <div style={styles.examContainerInner}>
                                <span style={styles.question}>
                                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text}
                                </span>
                                {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                                    this.getMedia(this.state.exam[this.state.current].media, true)
                                }
                                <div style={styles.answerContainer}>
                                    <Input
                                        type="textarea"
                                        name="text"
                                        id="answer"
                                        disabled={this.state.isTimeOut}
                                        style={styles.answerTextInput}
                                        placeholder={word[window.language].answer}
                                        value={this.state.answer[this.state.current] ? this.state.answer[this.state.current].text : ''}
                                        onChange={(e) => {
                                            if (!this.state.answer[this.state.current]) {
                                                this.state.answer[this.state.current] = {}
                                                this.state.answer[this.state.current].qid = this.state.exam[this.state.current].qid
                                                // this.setState({ answer: { ...this.state.answer, [this.state.current]: { "qid": this.state.exam[this.state.current].qid, "cid": c.cid } } })
                                            }
                                            if (e.target.value) {
                                                this.state.answer[this.state.current].text = e.target.value
                                            }
                                            else {
                                                this.state.answer[this.state.current] = undefined
                                            }

                                            this.forceUpdate()
                                        }}
                                    />
                                </div>
                            </div>
                            :
                            null
                        }

                        {this.state.questionType === 'normal' && this.state.exam[this.state.current] && this.state.exam[this.state.current].choices && this.state.exam[this.state.current].choices.length > 0 && this.state.exam[this.state.current].type === 'match' ?
                            //match and order
                            <div style={styles.examContainerInner}>
                                <span style={styles.question}>
                                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text}
                                </span>
                                <div >
                                    {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                                        this.getMedia(this.state.exam[this.state.current].media, true)
                                    }
                                </div>
                                <div style={{ ...styles.answerContainer }}>
                                    <div style={styles.answerMatchContainer}>
                                        <div style={styles.matchBtn}>
                                            <p style={styles.text} color={'danger'}>{word[window.language].article}</p>
                                        </div>
                                        <div style={styles.matchBtn}>
                                            <p style={styles.text} color={'success'}>{word[window.language].answer}</p>
                                        </div>
                                    </div>
                                    {this.state.exam[this.state.current].choices.map((item, index) => {
                                        let answer = this.state.answer[this.state.current] && this.state.answer[this.state.current].multiChoice.find(p => { return p.cid === item.cid })
                                        // console.log(index, answer, this.state.exam[this.state.current].pair)
                                        return (
                                            <div key={index} style={styles.answerMatchContainer}>
                                                <div style={styles.matchBtn}>
                                                    <Button style={styles.matchingBtn} /*outline*/ color="danger" disabled>{item.text}</Button>
                                                </div>
                                                <FontAwesomeIcon icon={faArrowsAltH} style={{ ...styles.startMainQuizBtnIco, color: '#aaa' }} />
                                                <div style={styles.matchBtn}>
                                                    {/* <Button style={styles.matchingBtn} outline color="success">123456798</Button> */}
                                                    <Dropdown
                                                        isOpen={this.state.matchingDropdownOpenIndex === index}
                                                        toggle={() => {
                                                            this.setState({ matchingDropdownOpenIndex: this.state.matchingDropdownOpenIndex === index ? -1 : index })
                                                        }}
                                                    >
                                                        <DropdownToggle style={{ ...styles.matchingBtn, color: !answer ? '#ccc' : 'green' }} outline color="success">
                                                            {answer ? this.state.exam[this.state.current].pair.find(p => { return p.pid === answer.pid }).text : '-'}
                                                        </DropdownToggle>
                                                        <DropdownMenu style={styles.dropdownMenu}>
                                                            {this.state.exam[this.state.current].pair.map((item_a, index_a) => {
                                                                return (
                                                                    <DropdownItem
                                                                        key={index_a}
                                                                        onClick={() => {
                                                                            this.setMatchAnswer(item, item_a)
                                                                        }}
                                                                        style={{ textAlign: 'center' }}
                                                                    >
                                                                        {item_a.text}
                                                                    </DropdownItem>
                                                                )
                                                            })}
                                                            <DropdownItem
                                                                onClick={() => {
                                                                    let i = this.state.answer[this.state.current] && this.state.answer[this.state.current].multiChoice.findIndex(a => { return a.cid === item.cid })
                                                                    if (i > -1) {
                                                                        this.state.answer[this.state.current].multiChoice.splice(i, 1)
                                                                        this.forceUpdate()
                                                                    }
                                                                }}
                                                                style={{ textAlign: 'center' }}
                                                            >
                                                                -
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            :
                            null
                        }

                        {this.state.questionType === 'video' ?
                            //video
                            <div style={styles.examContainerInner}>
                                <div style={styles.videoExamPlayerContainer}>
                                    <Player
                                        ref="player"
                                        startTime={0}
                                        controls
                                        fluid={false}
                                        width={'100%'}
                                        height={'100%'}
                                        poster={'http://student.questionquick.com' + this.state.pickedQuizData.exam.media.path.replace('.mp4', '.png')}
                                        src={'http://student.questionquick.com' + this.state.pickedQuizData.exam.media.path}
                                    />
                                </div>
                                {this.state.latestVideoIndex > -1 ?
                                    <div>
                                        <div style={styles.cutLine} />
                                        <span style={styles.question}>
                                            {this.state.exam[this.state.latestVideoIndex] && this.state.exam[this.state.latestVideoIndex].text}
                                        </span>
                                        <div style={styles.answerContainer}>
                                            {this.state.exam[this.state.latestVideoIndex] && this.state.exam[this.state.latestVideoIndex].choices.map((c, index) => {
                                                let timeoutOpacity = this.state.isTimeOut ? 0.5 : 1
                                                let btnStyle = { width: '97%', backgroundColor: JSON.stringify(this.state.answer[this.state.latestVideoIndex]) === JSON.stringify({ "qid": this.state.exam[this.state.latestVideoIndex].qid, "cid": c.cid }) ? '#2abaf0' : '#fff', border: '2px solid #2abaf0', padding: 0, borderRadius: 30, marginTop: 10 }
                                                return (
                                                    <div key={index} style={{ ...styles.answerBtnContainer, opacity: timeoutOpacity }}>
                                                        <div style={styles.answerContainerInner}>
                                                            <Button
                                                                onClick={() => {
                                                                    if (JSON.stringify(this.state.answer[this.state.latestVideoIndex]) === JSON.stringify({ "qid": this.state.exam[this.state.latestVideoIndex].qid, "cid": c.cid })) {
                                                                        this.setState({ answer: { ...this.state.answer, [this.state.current]: undefined } })
                                                                    }
                                                                    else {
                                                                        this.setState({ answer: { ...this.state.answer, [this.state.latestVideoIndex]: { "qid": this.state.exam[this.state.latestVideoIndex].qid, "cid": c.cid } } })
                                                                        this.refs.player.play()
                                                                        // if (this.state.latestVideoIndex < this.state.exam.length - 1) {
                                                                        //     this.setState({ latestVideoIndex: this.state.latestVideoIndex + 1 })
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
                                    :
                                    <div>
                                        <div style={styles.cutLine} />
                                        <span style={{ color: '#aaa' }}>{word[window.language].notHaveQuestionYet}</span>
                                    </div>
                                }
                            </div>
                            :
                            null
                        }

                        {false ?
                            //voting
                            <div style={styles.examContainerInner}>
                                <span style={styles.question}>
                                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text}
                                </span>
                                <div >
                                    {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                                        this.getMedia(this.state.exam[this.state.current].media, true)
                                    }
                                </div>
                                <div style={{ ...styles.answerContainer, display: 'flex', flexDirection: 'column', marginLeft: '10px', marginRight: '10px', flex: 1 }}>
                                    <span style={{ textAlign: 'right', color: '#aaa' }}>{word[window.language].onlyPickOne}</span>
                                    {votingData.map((item, index) => {
                                        return (
                                            <div key={index} style={styles.votingContainer}>
                                                <Button
                                                    outline={this.state.votedId && this.state.votedId === item._id ? false : true}
                                                    color={this.getDefaultColor(index)}
                                                    style={styles.votingBtn}
                                                    onClick={() => this.setState({ votedId: item._id })}
                                                    disabled={/*this.state.votedId && this.state.votedId !== item._id ? true : false*/this.state.isVoteSubmited}
                                                >
                                                    {item.value}
                                                </Button>
                                                {this.state.isVoteSubmited ?
                                                    <Progress multi style={styles.votingProgress}>
                                                        <Progress bar animated color={this.getDefaultColor(index)} value={this.getBarValue(item.amount, votingData)}>
                                                            <span style={{ marginLeft: '10px' }}>{item.amount + ' (' + this.getPercentValue(item.amount, votingData).toFixed(2) + '%)'} </span>
                                                        </Progress>
                                                    </Progress>
                                                    :
                                                    <Progress multi style={styles.votingProgress}>
                                                        <Progress bar animated color={this.getDefaultColor(index)} value={1}>
                                                            <span style={{ marginLeft: '10px' }}></span>
                                                        </Progress>
                                                    </Progress>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                                <div style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
                                <div>
                                    <Button onClick={() => this.setState({ isVoteSubmited: true })} color="primary" disabled={!this.state.votedId} block style={{ marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', height: 60 }}>
                                        <span style={{ ...styles.text, color: '#fff' }}>ส่งคำตอบ</span>
                                    </Button>
                                </div>
                            </div>
                            :
                            null
                        }

                        {false ?
                            //answer template
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

                                </div>
                            </div>
                            :
                            null
                        }

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
                        <Button disabled={this.state.isSendingAnswer} onClick={() => this.setState({ modal: false }, () => this.getAnswerData())} style={styles.sendAnswerBtnCancel}>
                            <span style={styles.sendAnswerBtnTxt}>{word[window.language].cancel}</span>
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
    ////VIEW////

    ////MODAL////
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
                    <br />
                    <span style={{ ...styles.quizDetailTxt2, color: '#000' }}>{this.state.pickedQuizData.exam.title}</span>
                </ModalHeader>
                <ModalBody>
                    <p style={styles.quizDetailTxt2}>({this.state.pickedQuiz.code})</p>
                    <span style={styles.quizDetailTxt3}>
                        <span style={styles.quizDetailTopic1}>{word[window.language].teacher}: </span>{this.state.pickedQuiz.teacher && this.state.pickedQuiz.teacher.name}</span>
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
    ////MODAL////

    render() {
        if (this.state.redirectHome) {
            return <Redirect push to="/" />;
        }

        if (!this.state.isFoundVideoRef && this.refs && this.refs.player) {
            this.setState({ isFoundVideoRef: true }, () => {
                this.refs.player.subscribeToStateChange(this.handleVideoStateChange.bind(this));
            })
        }

        return (
            <div className="login loginContainer">
                <SideNav isQuizStart={this.state.isStart} page={'home'} />
                <Alert isOpen={Boolean(this.state.toastData)} color="danger" style={{ position: 'absolute', width: '100%' }}>
                    {this.state.toastData}
                </Alert>
                {this.state.isLoading &&
                    <div style={styles.loadingContainer}>
                        <Spinner type="grow" color="warning" style={styles.loading} />
                    </div>
                }
                <div className='quizBox'>
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
    quizBox: { borderRadius: 10, /*borderWidth: 5, borderStyle: 'solid', borderColor: '#2abaf0', */width: '98%', padding: '5px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', },
    quizeventsContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, width: '100%', backgroundColor: 'transparent', borderWidth: 0, textDecoration: 'none' },
    quizeventsContainerInner: { display: 'flex', flexDirection: 'column', flex: 1 },
    quizeventsBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 },
    cutLine: { width: '100%', height: 1, backgroundColor: '#ccc' },
    outOffTimeTxt: { color: 'red', fontSize: '24px', fontFamily: 'DBH' },
    text: { color: '#000', fontFamily: 'DBH', fontSize: '24px' },

    chooseQuizContainer: { zIndex: 2, width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', marginLeft: '60px' },
    chooseQuizTopicBox: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    chooseQuizTopic: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px', alignSelf: 'flex-start', margin: 0, marginLeft: 30 },
    qrCodeIconButton: { marginRight: 50 },
    qrCodeIcon: {},
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

    quizDetailContainer: { zIndex: 2, width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '60px' },
    quizDetailTxt1: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px' },
    quizDetailTxt2: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '30px' },
    quizDetailTxt3: { color: '#7fd642', fontFamily: 'DBH', fontSize: '30px' },
    quizDetailTxt4: { color: '#555', fontFamily: 'DBH', fontSize: '30px' },
    quizDetailDescBox: { marginTop: 20, display: 'flex', flexDirection: 'column' },
    quizDetailTopic1: { color: '#555' },
    quizDetailTopic2: { color: '#337ab7', fontFamily: 'DBH', fontSize: '30px' },
    startMainQuizBtn: { width: '98%', height: '60px', background: '#f1683e', borderWidth: 0, padding: 0, borderRadius: '30px', margin: 10, alignSelf: "center" },
    startMainQuizBtnTxt: { fontFamily: 'DBH', color: '#fff', fontWeight: 'bolder', fontSize: '34px' },
    startMainQuizBtnIco: { width: '2vw', fontSize: '24px', color: '#fff' },
    startMainQuizBtnDisable: { width: '98%', height: '60px', background: '#ccc', borderWidth: 0, padding: 0, borderRadius: '30px', margin: 10, alignSelf: "center" },
    startQuizBtn: { width: '130px', height: '35px', background: '#f1683e', borderWidth: 2, padding: 0, borderRadius: '2vw', alignSelf: "center", borderColor: '#f1683e', borderStyle: 'solid', },
    startQuizBtnTxt: { fontFamily: 'DBH', color: '#fff', fontWeight: 'bolder', fontSize: '24px' },
    startQuizBtnIco: { width: '2vw', fontSize: '24px', color: '#fff' },
    backPickQuizBtn: { width: '130px', height: '35px', borderColor: '#aaa', borderStyle: 'solid', backgroundColor: '#fff', borderWidth: 2, padding: 0, borderRadius: '2vw', alignSelf: "center" },
    backPickQuizBtnTxt: { fontFamily: 'DBH', color: '#aaa', fontWeight: 'bolder', fontSize: '24px' },
    backPickQuizBtnIco: { width: '2vw', fontSize: '24px', color: '#aaa' },

    quizContainer: { zIndex: 2, width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'row', marginLeft: '60px' },
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
    diagramTxt: { fontSize: '18px', fontFamily: 'DBH', fontWeight: 500, color: '#000', marginTop: -5 },
    diagramDescContainer: { backgroundColor: '#fff29e', borderTop: '2px solid #ffeb67' },
    diagramDescBox: { display: 'flex', alignItems: 'center' },
    diagramDescBtn1: { width: '1.5vw', height: '1.5vw', border: '2px solid #337ab7', backgroundColor: '#fff', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn2: { width: '1.5vw', height: '1.5vw', backgroundColor: '#44b29c', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn3: { width: '1.5vw', height: '1.5vw', backgroundColor: '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtnTxt: { fontFamily: 'DBH', fontSize: '20px', fontWeight: '500', marginTop: 5 },
    quizBox1_4: { alignSelf: 'center', marginBottom: 10, marginLeft: 10, width: '95%', display: 'flex', flexDirection: 'row' },
    closeExamBtn: { width: 60, height: 50, borderRadius: 25, marginRight: 5, backgroundColor: 'red', borderWidth: 0 },
    finishBtn1: { width: '100%', background: '#ffe00f', marginLeft: 2, borderWidth: 0, padding: 0, height: 50, borderRadius: 25 },
    finishBtn2: { width: '100%', background: '#6ebb1f', marginLeft: 2, borderWidth: 0, padding: 0, height: 50, borderRadius: 25 },
    finishBtnTxt1: { fontFamily: 'DBH', fontWeight: 500, color: '#000', fontSize: '30px' },
    finishBtnTxt2: { fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '30px' },
    closeExamBtnIco: { fontSize: '20px', color: '#fff', },
    finishBtnIco1: { fontSize: '20px', color: '#000', marginLeft: 5 },
    finishBtnIco2: { fontSize: '20px', color: '#fff', marginLeft: 5 },
    quizBox2: { display: 'flex', flexDirection: 'column', flex: 4 },
    examTopicContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    examTopicTxt: { fontFamily: 'DBH', fontWeight: 'bolder', color: '#ff5f6d', fontSize: '34px', textAlign: 'left', marginTop: 12, marginLeft: 20 },
    examRouter: { display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
    routerBtn: { width: '150px', background: '#f1673e', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" },
    routerBtnDisable: { width: '150px', background: '#aaa', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" },
    routerBtnIco: { width: '1.75vw', fontSize: '24px' },
    routerBtnTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '30px' },
    examContainer: { display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff', margin: 10, marginTop: 0, border: '2px solid #ff5f6d', borderRadius: 10, overflow: 'hidden' },
    examContainerInner: { overflowY: 'scroll', display: 'flex', flex: 1, paddingLeft: '10px', width: '100%', flexDirection: 'column', marginTop: '5px' },
    videoExamPlayerContainer: { width: '100%', height: '45vh', marginBottom: 10, marginLeft: 'auto', marginRight: 'auto', marginTop: 5 },
    question: { fontFamily: 'DBH', fontSize: '30px', fontWeight: 500, textAlign: 'left', marginLeft: 10, marginBottom: 10, display: 'flex', color: '#1c5379' },
    answerContainer: { display: 'flex', /*flex: 1,*/ flexWrap: 'wrap', flexDirection: 'row' },
    answerMatchContainer: { display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' },
    answerTextInput: { resize: 'none', display: 'flex', flex: 1, marginLeft: '15px', marginRight: '5px', height: '200px', marginTop: '10px', marginBottom: '10px' },
    answerBtnContainer: { width: '45%', marginBottom: 20, marginLeft: '2.5%', },
    answerContainerInner: { backgroundColor: '#eee', borderRadius: 30, paddingBottom: 10 },
    answerTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#1c5379', fontSize: '30px' },
    answerContainerFullfill: { display: 'flex', flex: 1 },
    matchBtn: { width: '100%', justifyContent: 'center' },
    matchingBtn: { fontFamily: 'DBH', fontSize: '25px', width: '75%', marginBottom: '10px', marginTop: '10px', height: '50px', borderRadius: '25px' },
    dropdownMenu: { width: '98%', marginBottom: '10px', marginRight: '2%' },
    votingContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' },
    votingBtn: { width: '200px', marginRight: '5px', height: '50px' },
    votingProgress: { width: '100%', height: '50px' },
    sendingAnswerLoading: { width: '3rem', height: '3rem', margin: 'auto' },
    sendingAnswerTxt: { color: '#1c5379', fontFamily: 'DBH', fontSize: '30px', fontWeight: '500' },
    sendingAnswerWarning: { color: 'red', fontFamily: 'DBH', fontSize: '30px', fontWeight: '500', display: 'flex', flexDirection: 'row', alignItems: 'center' },
    sendingAnswerWarningIco: { width: '30px', fontSize: '1.5vw', marginRight: 5 },
    sendAnswerBtnTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontSize: '24px' },
    sendAnswerBtnConfirm: { width: '50%', background: '#00adee', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 },
    sendAnswerBtnCancel: { width: '50%', background: 'red', borderWidth: 0, padding: 0, borderRadius: 30, alignSelf: "center", paddingLeft: 15, paddingRight: 15 },

    decorateLeft: { bottom: 0, left: 0, position: 'absolute', width: '25vw', marginLeft: '60px' },
    decorateRight: { bottom: 0, right: 0, position: 'absolute', width: '25vw' },

    Toast: { position: 'absolute' },

    preview: {
        position: 'relative',
    },
    captureContainer: {
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 1,
        bottom: 0,
        width: '100%'
    },
    captureButton: {
        backgroundColor: '#fff',
        borderRadius: '50%',
        height: 56,
        width: 56,
        color: '#000',
        margin: 20
    },
    captureImage: {
        width: '100%',
    }
}

export default Test;