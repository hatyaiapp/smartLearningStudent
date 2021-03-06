import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse, Spinner, CustomInput, Collapse, Toast, ToastHeader, ToastBody, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress, Alert } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClock, faFileAlt, faCalendarAlt, faCaretRight, faCaretLeft, faInfoCircle, faArrowsAltH, faChevronCircleLeft, faStarHalfAlt, faCheckCircle, faTimesCircle, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav from '../_component/sideNav'
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

class CodeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

let word = {
    th: {
        history: 'ประวัติการสอบ',
        point: 'คะแนน',
        detail: 'รายละเอียด',
        dontHaveExamHistory: 'ยังไม่มีประวัติการสอบในขณะนี้',
        goBack: 'ย้อนกลับ',
        hour: 'ชั่วโมง',
        minute: 'นาที',
        welcome: 'ยินดีต้อนรับ',
        questionDiagram: 'แผนผังข้อสอบ',
        question: 'ข้อที่',
        from: 'จาก',
        back: 'ย้อนกลับ',
        forward: 'ถัดไป',
        current: 'ข้อปัจจุบัน',
        correct: 'ตอบถูก',
        wrong: 'ตอบผิด',
        uncheck: 'ยังไม่ตรวจ',
        notSelected: 'ไม่ได้ตอบ',
        answer: 'คำตอบ',
        article: 'คำถาม',
        notHaveQuestionYet: 'ยังไม่มีคำถามในขณะนี้',
        solutionTopic: 'เฉลยข้อสอบ'
    },
    en: {
        history: 'Exam history',
        point: 'POINT',
        detail: 'DETAIL',
        dontHaveExamHistory: 'There is no exam result at this time.',
        goBack: 'GO BACK',
        hour: 'Hours',
        minute: 'Minutes',
        welcome: 'Welcome',
        questionDiagram: 'Question Diagram',
        question: 'Question',
        from: 'From',
        back: 'Back',
        forward: 'Forward',
        current: 'Current',
        correct: 'Correct',
        wrong: 'Wrong',
        uncheck: 'Uncheck',
        notSelected: 'Not selected',
        answer: 'Answer',
        article: 'Article',
        notHaveQuestionYet: 'There are no questions at this time.',
        solutionTopic: 'Solution'
    }
}

export default class Setting extends Component {
    constructor() {
        super();
        this.state = {
            redirectHome: false,
            history: [],
            pickedHistory: null,
            current: 0,
            questionType: 'normal',
            latestVideoIndex: -1,
            isFoundVideoRef: false,
            isLoading: true,
            isLoadingVote: false,

            exam: []
        }
    }

    componentDidMount() {
        let _this = this
        window.onpopstate = function (e) {
            if (_this.state.pickedHistory) {
                window.history.go(1)
                _this.setState({ pickedHistory: null })
            }
        }
        fetch('http://student.questionquick.com/answersheet/',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(e => {
                if (e.message === 'Not Login') {
                    this.setState({ redirectHome: true })
                }
                else {
                    this.setState({ history: e, isLoading: false })
                }
            })

        fetch('http://student.questionquick.com/profile',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(user => {
                if (user.message === 'Not Login') {

                }
                else {
                    this.setState({ user })
                }
            })

        fetch('http://student.questionquick.com/course',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(qstn => {
                if (qstn.message === 'Not Login') {

                }
                else {
                    this.setState({ qstn })
                }
            })
    }

    //////////////////////////////ACTIVE//////////////////////////////
    videoJumper(i) {
        if (this.refs.player && this.state.exam[i]) {
            this.refs.player.seek(this.state.exam[i].second)
        }
    }

    handleVideoStateChange(state, prevState) {
        if (
            this.state.exam.find((e, index) => {
                return (
                    Math.floor(state.currentTime) === e.second &&
                    this.state.latestVideoIndex !== index
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
        this.forceUpdate()
    }

    getExamDetail(h) {
        fetch('http://student.questionquick.com/answersheet/' + h._id, {
            credentials: 'include'
        })
            .then(asres => asres.json())
            .then(fullDesc => {
                fetch('http://student.questionquick.com/exam/' + h.exam._id + '/questions',
                    {
                        credentials: 'include',
                    })
                    .then(res => res.json())
                    .then(exam => {
                        fullDesc.course = h.course
                        fullDesc.exam = h.exam
                        let quizevents = this.state.qstn.find(qs => {
                            return qs.quizevents.find(qe => {
                                return qe.qeid === h.quizevent
                            })
                        })

                        let quizevent;

                        if (quizevents) {
                            quizevent = quizevents.quizevents.find(qe => { return qe.qeid === h.quizevent })
                        }
                        if (quizevent.exam.type === 'video') {
                            this.loop = setInterval(() => {
                                this.forceUpdate()
                            }, 1000);
                        }

                        // console.log(fullDesc)

                        this.setState({ exam, pickedHistory: fullDesc, questionType: quizevent.exam.type, quizevent: quizevent }, () => {
                            if (this.state.isLoadingVote) {
                                let _this = this
                                setTimeout(() => {
                                    _this.setState({ isLoadingVote: false })
                                }, 2000);
                            }
                        })
                    })
                    .catch(e => {
                        this.setState({ isFetchingExam: false, isLoadingVote: false })
                    })
            })
    }
    //////////////////////////////ACTIVE//////////////////////////////

    //////////////////////////////GETTER//////////////////////////////
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

    getProgress() {
        let pickCount = 0
        for (let i in this.state.exam) {
            if (this.state.answer[i] !== undefined) {
                pickCount++
            }
        }
        return pickCount + '/' + this.state.exam.length
    }

    getDiagramBG(d) {
        let data = this.state.pickedHistory.questions.find(a => { return a.qid === d.qid })
        if (this.state.questionType === 'vote') {
            return '#d9d5d5'
        }
        else if (!data || !data.answer) {
            return '#d9d5d5'
        }
        else if (data.answer && data.answer.result && data.answer.result.correct === true) {
            return '#96ceb4'
        }
        else if (data.answer && data.answer.result && data.answer.result.correct === false) {
            return '#ff6e69'
        }
        else {
            return '#ffeeae'
        }
    }

    getPickIndex() {
        if (this.state.questionType === 'normal') {
            return this.state.current
        }
        else if (this.state.questionType === 'video') {
            return this.state.latestVideoIndex
        }
    }

    getMedia(media, isQuestion) {
        if (media.type === 'image') {
            let imageBox = { marginBottom: isQuestion ? 20 : 10, marginTop: isQuestion ? 0 : 10, marginLeft: 'auto', marginRight: 'auto' }
            let imageStyle = { height: isQuestion ? '30vh' : 'auto', width: isQuestion ? 'auto' : '18vw', borderRadius: 7 }
            return <div style={imageBox}>
                <img src={'http://student.questionquick.com' + media.path} alt={''} style={imageStyle} />
            </div>
        }
        else if (media.type === 'video') {
            let videoBox = { width: isQuestion ? '100%' : '17vw', height: isQuestion ? '45vh' : 'auto', marginBottom: isQuestion ? 20 : 10, margin: 'auto', marginTop: isQuestion ? 0 : 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: 7 }
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
            let audioBox = { width: isQuestion ? '30vw' : '18vw', marginBottom: isQuestion ? 20 : 0, margin: 'auto', marginTop: isQuestion ? 0 : 10, marginLeft: 'auto', marginRight: 'auto' }
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

    getTextAnswer() {
        let qid = this.state.exam[this.state.current].qid
        let data = this.state.pickedHistory.answers.find(a => { return a.qid === qid })
        return data.text
    }

    getResultStatus() {
        let data
        if (this.state.questionType === 'normal') {
            // data = this.state.pickedHistory.answers.find(a => { return a.qid === this.state.exam[this.state.current].qid })
            data = this.state.pickedHistory.questions[this.getPickIndex()].answer
        }
        else if (this.state.questionType === 'video' && this.state.latestVideoIndex > -1) {
            // data = this.state.pickedHistory.answers.find(a => { return this.state.exam[this.state.latestVideoIndex] && a.qid === this.state.exam[this.state.latestVideoIndex].qid })
            data = this.state.pickedHistory.questions[this.getPickIndex()].answer
        }
        if (this.state.questionType === 'vote') {
            return null
        }
        else if (this.state.questionType === 'video' && this.state.latestVideoIndex < 0) {
            return null
        }
        else if (!data) {
            return <span style={{ color: '#d9d5d5' }}> ({word[window.language].notSelected})</span>
        }
        else if (data.result && data.result.correct === true) {
            return <span style={{ color: '#96ceb4' }}> ({word[window.language].correct})</span>
        }
        else if (data.result && data.result.correct === false) {
            return <span style={{ color: '#ff6e69' }}> ({word[window.language].wrong})</span>
        }
        else {
            return <span style={{ color: '#ffeeae' }}> ({word[window.language].uncheck})</span>
        }
    }

    isAllMatch(ans) {
        for (let i in ans.pair) {
            if (ans.pair[i].correct !== ans.answer.multiChoice.find(c => { return c.pid === ans.pair[i].pid }).cid) {
                return false
            }
        }
        return true
    }

    isAllCheck() {
        for (let i in this.state.pickedHistory.questions) {
            if (!this.state.pickedHistory.questions[i].answer || !this.state.pickedHistory.questions[i].answer.result) {
                return true
            }
        }
        return false
    }

    getDefaultColor(i) {
        let color = ['primary', 'danger', 'success', 'warning', 'info', 'secondary']
        return color[i % 6]
    }

    getBarValue(a, data_) {
        let data = JSON.parse(JSON.stringify(data_))
        let userPicked = data.find(d => { return d.cid === a.cid })
        let max = Math.max.apply(Math, data.map(function (o) { return o.counts; }))
        return userPicked.counts / max * 100
    }

    getCountsValue(a, data_) {
        let data = JSON.parse(JSON.stringify(data_))
        let userPicked = data.find(d => { return d.cid === a.cid })
        return userPicked.counts
    }

    getPercentValue(a, data_) {
        let data = JSON.parse(JSON.stringify(data_))
        let userPicked = data.find(d => { return d.cid === a.cid })
        let sum = data.reduce((a, b) => +a + +b.counts, 0);
        return (userPicked.counts / sum * 100).toFixed(2)
    }
    //////////////////////////////GETTER//////////////////////////////

    //////////////////////////////VIEWER//////////////////////////////
    examDetailView() {
        return (
            <div style={styles.quizContainer}>
                <div style={styles.quizBox1}>
                    {this.examDetailViewDesc()}
                    {this.examDetailViewDiagram()}
                    <div style={styles.quizBox1_4}>
                        <Button
                            onClick={() => {
                                this.setState({ pickedHistory: null, isFoundVideoRef: false, latestVideoIndex: -1, current: 0 })
                                delete this.refs.player;
                            }}
                            style={styles.closeExamBtn}
                        >
                            <FontAwesomeIcon icon={faChevronCircleLeft} style={styles.closeExamBtnIco} />
                            <span> {word[window.language].goBack}</span>
                        </Button>
                    </div>
                </div>
                <div style={styles.quizBox2}>
                    {this.examDetailViewTopic()}

                    <div style={styles.examContainer}>
                        {this.state.questionType === 'normal' && this.state.exam[this.state.current] && this.state.exam[this.state.current].choices && this.state.exam[this.state.current].choices.length > 0 && (this.state.exam[this.state.current].type === 'choice' || !this.state.exam[this.state.current].type) ?
                            //choice
                            this.examDetailViewQuestionChoice() : null
                        }

                        {this.state.questionType === 'normal' && this.state.exam[this.state.current] && this.state.exam[this.state.current].choices && this.state.exam[this.state.current].choices.length === 0 ?
                            //text
                            this.examDetailViewQuestionText() : null
                        }

                        {this.state.questionType === 'normal' && this.state.exam[this.state.current] && this.state.exam[this.state.current].choices && this.state.exam[this.state.current].choices.length > 0 && this.state.exam[this.state.current].type === 'match' ?
                            //match and order
                            this.examDetailViewQuestionMatch() : null
                        }

                        {this.state.questionType === 'video' ?
                            //video
                            this.examDetailViewQuestionVideo() : null
                        }

                        {this.state.questionType === 'vote' ?
                            //vote
                            this.examDetailViewQuestionVote() : null
                        }

                    </div>
                </div>
            </div>
        )
    }

    examDetailViewDesc() {
        return (
            <div style={styles.quizBox1_1}>
                <p style={styles.quizBox1_1Topic}>{word[window.language].welcome}</p>
                <div style={styles.quizBox1_1Box}>
                    <div style={styles.quizBox1_1DetailBox}>
                        <FontAwesomeIcon icon={faUser} style={styles.quizBox1_1DetailIco} />
                        <span style={styles.quizBox1_1DetailTxt}>: {this.state.user && this.state.user.name}</span>
                    </div>
                    <div style={styles.quizBox1_1DetailBox}>
                        <FontAwesomeIcon icon={faFileAlt} style={styles.quizBox1_1DetailIco} />
                        <span style={styles.quizBox1_1DetailTxt}>: {this.state.pickedHistory && this.state.pickedHistory.exam.title}</span>
                    </div>
                    {this.state.questionType !== 'vote' &&
                        <div style={styles.quizBox1_1DetailBox}>
                            <FontAwesomeIcon icon={faStarHalfAlt} style={styles.quizBox1_1DetailIco} />
                            <span style={styles.quizBox1_1DetailTxt}>: {this.state.pickedHistory && this.state.pickedHistory.totalPoint}{this.isAllCheck() && '+'} {word[window.language].point}</span>
                        </div>
                    }
                </div>
            </div>
        )
    }

    examDetailViewDiagram() {
        return (
            <div style={styles.quizBox1_3}>
                <div style={styles.examTopicBox}>
                    <div style={styles.icoBox} />
                    <p style={styles.diagramTopicTxt}><FontAwesomeIcon icon={faCalendarAlt} style={styles.icoBox} />{word[window.language].questionDiagram}</p>
                    <FontAwesomeIcon id="toggler" icon={faInfoCircle} style={styles.diagramTopicIco} />
                </div>
                <div style={styles.diagramContainer}>
                    <div style={styles.diagramBox}>
                        <div style={styles.diagramBoxInner}>
                            {this.state.exam.map((d, index) => {
                                let diagramBtn = { width: '20px', height: '20px', backgroundColor: this.getDiagramBG(d), marginTop: 2, marginLeft: 2, padding: 0 }
                                //border: this.state.current === index ? '2px solid #337ab7' : '2px solid transparent',
                                if ((this.state.questionType === 'normal' || this.state.questionType === 'vote') && this.state.current === index) {
                                    diagramBtn.border = '2px solid #337ab7'
                                }
                                else if (this.state.questionType === 'video' && this.state.latestVideoIndex === index) {
                                    diagramBtn.border = '2px solid #337ab7'
                                }
                                else {
                                    diagramBtn.border = '2px solid transparent'
                                }

                                return (
                                    <Button
                                        key={index}
                                        onClick={() => {
                                            this.state.questionType === 'video' ?
                                                this.videoJumper(index)
                                                :
                                                this.setState({ current: index })
                                        }}
                                        style={diagramBtn}
                                    >
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
                                <span style={styles.diagramDescBtnTxt}>{word[window.language].correct}</span>
                            </div>
                            <div style={styles.diagramDescBox}>
                                <div style={styles.diagramDescBtn3} />
                                <span style={styles.diagramDescBtnTxt}>{word[window.language].wrong}</span>
                            </div>
                            <div style={styles.diagramDescBox}>
                                <div style={styles.diagramDescBtn4} />
                                <span style={styles.diagramDescBtnTxt}>{word[window.language].uncheck}</span>
                            </div>
                            <div style={styles.diagramDescBox}>
                                <div style={styles.diagramDescBtn5} />
                                <span style={styles.diagramDescBtnTxt}>{word[window.language].notSelected}</span>
                            </div>
                        </div>
                    </UncontrolledCollapse>
                </div>
            </div>
        )
    }

    examDetailViewTopic() {
        return (
            <div style={styles.examTopicContainer}>
                <h1 style={styles.examTopicTxt}>{word[window.language].question} {this.state.questionType === 'video' ? this.state.latestVideoIndex + 1 : this.state.current + 1} {word[window.language].from} {this.state.exam.length} {this.getResultStatus()}</h1>
                <div style={styles.examRouter}>
                    {((this.state.questionType === 'normal' || this.state.questionType === 'vote') && this.state.current > 0) || (this.state.questionType === 'video' && this.state.latestVideoIndex > 0) ?
                        <Button onClick={() => { (this.state.questionType === 'normal' || this.state.questionType === 'vote') ? this.setState({ current: this.state.current - 1 }) : this.videoJumper(this.state.latestVideoIndex - 1) }} style={styles.routerBtn}>
                            <FontAwesomeIcon icon={faCaretLeft} style={styles.routerBtnIco} />
                            <span style={styles.routerBtnTxt}>{word[window.language].back}</span>
                        </Button>
                        :
                        <Button disabled onClick={() => null} style={styles.routerBtnDisable}>
                            <FontAwesomeIcon icon={faCaretLeft} style={styles.routerBtnIco} />
                            <span style={styles.routerBtnTxt}>{word[window.language].back}</span>
                        </Button>
                    }
                    {((this.state.questionType === 'normal' || this.state.questionType === 'vote') && this.state.current !== (this.state.exam.length - 1)) || (this.state.questionType === 'video' && this.state.latestVideoIndex !== (this.state.exam.length - 1)) ?
                        <Button onClick={() => { (this.state.questionType === 'normal' || this.state.questionType === 'vote') ? this.setState({ current: this.state.current + 1 }) : this.videoJumper(this.state.latestVideoIndex + 1) }} style={styles.routerBtn}>
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
        )
    }

    ///EXAM///
    examDetailViewQuestionChoice() {
        let correctChoice = this.state.pickedHistory.questions[this.getPickIndex()].choices.filter(c => { return c.correct })
        let correctAns = this.state.pickedHistory.questions[this.getPickIndex()]
        return (
            <div style={styles.examContainerInner}>
                <span style={styles.question}>
                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text + ' (' + this.state.exam[this.state.current].point + ' ' + word[window.language].point + ')'}
                </span>
                <div >
                    {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                        this.getMedia(this.state.exam[this.state.current].media, true)
                    }
                </div>
                <div style={styles.answerContainer}>
                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].choices.map((c, index) => {
                        let id = this.state.exam[this.state.current].qid
                        let cid = c.cid
                        // let data = this.state.pickedHistory.answers.find(a => { return a.qid == id })
                        let data = this.state.pickedHistory.questions[this.getPickIndex()].answer
                        let btnStyle = { width: '97%', padding: 0, borderRadius: 30, marginTop: 10, cursor: 'default', backgroundColor: '#fff', border: '2px solid #2abaf0', marginLeft: 'auto', marginRight: 'auto' }

                        let btnType = 'normal'
                        if (data && cid === data.cid && correctChoice.findIndex(ca => ca.cid === data.cid) < 0) {
                            btnStyle.backgroundColor = '#ff6e69'
                            btnStyle.border = '2px solid #ff6e69'
                            btnType = 'wrong'
                        }
                        else if (correctChoice && correctChoice.findIndex(ca => ca.cid === cid) > -1) {
                            btnStyle.backgroundColor = '#96ceb4'
                            btnStyle.border = '2px solid #96ceb4'
                            btnType = 'correct'
                        }

                        return (
                            <div key={index} style={{ ...styles.answerBtnContainer }}>
                                <div style={styles.answerContainerInner}>
                                    <Button
                                        style={btnStyle}
                                    >
                                        <span style={styles.answerTxt}>{c.text}</span>
                                    </Button>
                                    {c.media && this.getMedia(c.media, false)}
                                    {btnType === 'correct' ?
                                        <FontAwesomeIcon icon={faCheckCircle} style={{ ...styles.answerIco, color: '#28a746' }} />
                                        :
                                        btnType === 'wrong' ?
                                            <FontAwesomeIcon icon={faTimesCircle} style={{ ...styles.answerIco, color: '#dc3446' }} />
                                            :
                                            null
                                    }
                                </div>
                                <div style={styles.answerContainerFullfill} />
                            </div>
                        )
                    })}
                </div>
                {correctAns && correctAns.solution &&
                    <div style={styles.solutionBox}>
                        <h4 style={styles.solutionTopic}>{word[window.language].solutionTopic}</h4>
                        <p style={styles.solutionTxt}>{correctAns.solution}</p>
                    </div>
                }
            </div>
        )
    }

    examDetailViewQuestionText() {
        let correctAns = this.state.pickedHistory.questions[this.getPickIndex()]
        // let correctAns = this.state.pickedHistory.answers.find(ans => { return ans.qid === this.state.exam[this.state.current].qid })
        return (
            <div style={styles.examContainerInner}>
                <span style={styles.question}>
                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text + ' (' + this.state.exam[this.state.current].point + ' ' + word[window.language].point + ')'}
                </span>
                {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                    this.getMedia(this.state.exam[this.state.current].media, true)
                }
                <div style={styles.answerContainer}>
                    <div className={'textBoxContainer'} style={styles.answerTextInputBox}>
                        <p className={'textBox'}>
                            {correctAns.answer && correctAns.answer.text}
                        </p>
                        {/* <input style={styles.answerTextInput}>{this.getTextAnswer()}</input> */}
                    </div>
                </div>
                {correctAns.solution &&
                    <div style={styles.solutionBox}>
                        <h4 style={styles.solutionTopic}>{word[window.language].solutionTopic}</h4>
                        <p style={styles.solutionTxt}>{correctAns.solution}</p>
                    </div>
                }
            </div>
        )
    }

    examDetailViewQuestionMatch() {
        // let correctAns = this.state.pickedHistory.answers.find(ans => { return ans.qid === this.state.exam[this.state.current].qid })
        let correctAns = this.state.pickedHistory.questions[this.getPickIndex()]
        let answer = correctAns.answer && correctAns.answer.multiChoice
        return (
            <div style={styles.examContainerInner}>
                <span style={styles.question}>
                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text + ' (' + this.state.exam[this.state.current].point + ' ' + word[window.language].point + ')'}
                </span>
                <div >
                    {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                        this.getMedia(this.state.exam[this.state.current].media, true)
                    }
                </div>
                <div style={{ ...styles.answerContainer }}>
                    <div style={styles.answerMatchContainer}>
                        <div style={styles.matchBtn}>
                            <p style={{ ...styles.text, marginLeft: 'auto', marginRight: 'auto' }} color={'danger'}>{word[window.language].article}</p>
                        </div>
                        <div style={styles.matchBtn}>
                            <p style={{ ...styles.text, marginLeft: 'auto', marginRight: 'auto' }} color={'success'}>{word[window.language].answer}</p>
                        </div>
                    </div>
                    {this.state.exam[this.state.current].choices.map((item, index) => {
                        let answerPid = answer && answer.find(a => { return a.cid === item.cid }) && answer.find(a => { return a.cid === item.cid }).pid
                        let answerData
                        if (answerPid) {
                            answerData = correctAns.pair.find(p => { return p.pid === answerPid })
                        }

                        let BtnClr = answerData ? answerData.correct === item.cid ? 'success' : "danger" : 'danger'
                        return (
                            <div key={index} style={styles.answerMatchContainer}>
                                <div style={styles.matchBtn}>
                                    <Button style={styles.matchingBtn} color="primary" disabled>{item.text}</Button>
                                </div>
                                <FontAwesomeIcon icon={faArrowsAltH} style={{ ...styles.startMainQuizBtnIco, color: '#aaa' }} />
                                <div style={styles.matchBtn}>
                                    <Button style={styles.matchingBtn} color={BtnClr} disabled>{answerData ? answerData.text : '-'}</Button>
                                    {BtnClr === 'success' ?
                                        <FontAwesomeIcon icon={faCheckCircle} style={{ ...styles.answerIco, color: '#28a746' }} />
                                        :
                                        BtnClr === 'danger' || !answerData ?
                                            <FontAwesomeIcon icon={faTimesCircle} style={{ ...styles.answerIco, color: '#dc3446' }} />
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>

                {!this.isAllMatch(correctAns) &&
                    <div style={{ ...styles.answerContainer }}>
                        <div style={{ ...styles.cutLine, marginTop: 30 }} />
                        <span style={{ ...styles.answerTopicTxt, textDecorationLine: 'underline' }}>{word[window.language].answer}</span>
                        <div style={styles.answerMatchContainer}>
                            <div style={styles.matchBtn}>
                                <p style={{ ...styles.text, marginLeft: 'auto', marginRight: 'auto' }} color={'danger'}>{word[window.language].article}</p>
                            </div>
                            <div style={styles.matchBtn}>
                                <p style={{ ...styles.text, marginLeft: 'auto', marginRight: 'auto' }} color={'success'}>{word[window.language].answer}</p>
                            </div>
                        </div>
                        {this.state.exam[this.state.current].choices.map((item, index) => {
                            let ans = correctAns.pair.find(p => { return p.correct === item.cid })
                            return (
                                <div key={index} style={styles.answerMatchContainer}>
                                    <div style={styles.matchBtn}>
                                        <Button style={styles.matchingBtn} /*outline*/ color="info" disabled>{item.text}</Button>
                                    </div>
                                    <FontAwesomeIcon icon={faArrowsAltH} style={{ ...styles.startMainQuizBtnIco, color: '#aaa' }} />
                                    <div style={styles.matchBtn}>
                                        <Button style={styles.matchingBtn} /*outline*/ color={'info'} disabled>{ans && ans.text}</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }

                {correctAns.solution &&
                    <div style={styles.solutionBox}>
                        <h4 style={styles.solutionTopic}>{word[window.language].solutionTopic}</h4>
                        <p style={styles.solutionTxt}>{correctAns.solution}</p>
                    </div>
                }
            </div>
        )
    }

    examDetailViewQuestionVideo() {
        let correctChoice = this.state.pickedHistory.questions[this.getPickIndex()] && this.state.pickedHistory.questions[this.getPickIndex()].choices.filter(c => { return c.correct })
        let correctAns = this.state.pickedHistory.questions[this.getPickIndex()]

        return (
            <div style={styles.examContainerInner}>
                <div style={styles.videoExamPlayerContainer}>
                    <Player
                        ref="player"
                        startTime={0}
                        controls
                        fluid={false}
                        width={'100%'}
                        height={'100%'}
                        poster={'http://student.questionquick.com' + this.state.quizevent.exam.media.path.replace('.mp4', '.png')}
                        src={'http://student.questionquick.com' + this.state.quizevent.exam.media.path}
                    />
                </div>
                {this.state.latestVideoIndex > -1 ?
                    <div>
                        <div style={styles.cutLine} />
                        <span style={styles.question}>
                            {this.state.exam[this.state.latestVideoIndex] && this.state.exam[this.state.latestVideoIndex].text + ' (' + this.state.exam[this.state.latestVideoIndex].point + ' ' + word[window.language].point + ')'}
                        </span>
                        <div style={styles.answerContainer}>
                            {this.state.exam[this.state.latestVideoIndex] && this.state.exam[this.state.latestVideoIndex].choices.map((c, index) => {
                                let id = this.state.exam[this.state.current].qid
                                let cid = c.cid
                                // let data = this.state.pickedHistory.answers.find(a => { return a.qid == id })
                                let data = this.state.pickedHistory.questions[this.getPickIndex()].answer
                                let btnStyle = { width: '97%', padding: 0, borderRadius: 30, marginTop: 10, cursor: 'default', backgroundColor: '#fff', border: '2px solid #2abaf0', marginLeft: 'auto', marginRight: 'auto' }
                                let btnType;
                                if (data && cid === data.cid && correctChoice.findIndex(ca => ca.cid === data.cid) < 0) {
                                    btnStyle.backgroundColor = '#ff6e69'
                                    btnStyle.border = '2px solid #ff6e69'
                                    btnType = 'wrong'
                                }
                                else if (correctChoice && correctChoice.findIndex(ca => ca.cid === cid) > -1) {
                                    btnStyle.backgroundColor = '#96ceb4'
                                    btnStyle.border = '2px solid #96ceb4'
                                    btnType = 'correct'
                                }

                                return (
                                    <div key={index} style={styles.answerBtnContainer}>
                                        <div style={styles.answerContainerInner}>
                                            <Button style={btnStyle}>
                                                <span style={styles.answerTxt}>{c.text}</span>
                                            </Button>
                                            {c.media && this.getMedia(c.media, false)}
                                            {btnType === 'correct' ?
                                                <FontAwesomeIcon icon={faCheckCircle} style={{ ...styles.answerIco, color: '#28a746' }} />
                                                :
                                                btnType === 'wrong' ?
                                                    <FontAwesomeIcon icon={faTimesCircle} style={{ ...styles.answerIco, color: '#dc3446' }} />
                                                    :
                                                    null
                                            }
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
                {correctAns && correctAns.solution &&
                    <div style={styles.solutionBox}>
                        <h4 style={styles.solutionTopic}>{word[window.language].solutionTopic}</h4>
                        <p style={styles.solutionTxt}>{correctAns.solution}</p>
                    </div>
                }
            </div>
        )
    }

    examDetailViewQuestionVote() {
        let correctAns = this.state.pickedHistory.questions[this.getPickIndex()]
        return (
            <div style={{ ...styles.examContainerInner, display: 'flex', flex: 1 }}>
                <span style={styles.question}>
                    {this.state.exam[this.state.current] && this.state.exam[this.state.current].text}
                </span>
                {(this.state.exam[this.state.current] && this.state.exam[this.state.current].media) &&
                    this.getMedia(this.state.exam[this.state.current].media, true)
                }

                <div style={{ ...styles.answerContainer, display: 'flex', flexDirection: 'column', marginLeft: '10px', marginRight: '10px', flex: 1 }}>
                    {this.state.exam[this.state.current].choices.map((item, index) => {
                        return (
                            <div key={index} style={styles.votingContainer}>
                                <Button
                                    outline={this.state.pickedHistory.questions[this.state.current].answer && this.state.pickedHistory.questions[this.state.current].answer.cid === item.cid ? false : true}
                                    color={this.getDefaultColor(index)}
                                    style={styles.votingBtn}
                                    onClick={() => null}
                                    disabled={true}
                                >
                                    {item.text}
                                </Button>
                                <Progress multi style={styles.votingProgress}>
                                    <Progress bar animated color={this.getDefaultColor(index)} value={this.getBarValue(item, this.state.pickedHistory.questions[this.state.current].choices)}>
                                        <span style={{ marginLeft: '10px' }}>{this.getCountsValue(item, this.state.pickedHistory.questions[this.state.current].choices) + ' (' + this.getPercentValue(item, this.state.pickedHistory.questions[this.state.current].choices) + " %)"}</span>
                                    </Progress>
                                </Progress>
                            </div>
                        )
                    })}
                </div>
                <div style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
                <div>
                    <Button
                        onClick={() => this.setState({ isLoadingVote: true }, () => this.getExamDetail(this.state.pickedHistory))}
                        color={"warning"}
                        disabled={this.state.isLoadingVote}
                        block
                        style={{ marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', height: 60 }}
                    >
                        <span style={{ ...styles.text, color: '#fff' }}>{<FontAwesomeIcon icon={faRedoAlt} style={styles.sendingAnswerWarningIco} />}</span>
                    </Button>
                </div>
                {correctAns && correctAns.solution &&
                    <div style={styles.solutionBox}>
                        <h4 style={styles.solutionTopic}>{word[window.language].solutionTopic}</h4>
                        <p style={styles.solutionTxt}>{correctAns.solution}</p>
                    </div>
                }
            </div>
        )
    }
    ///EXAM///

    examPickerView() {
        return (
            <div style={styles.container}>
                <p style={styles.topic}>{word[window.language].history}</p>
                <div style={styles.box}>
                    {this.state.history.length > 0 ?
                        this.state.history.map((h, index) => {
                            let bg = index % 2 == 0 ? '#f8f8f8' : '#fff'
                            let clr = index % 2 == 0 ? '#F0592B' : '#FAAE3C'
                            return (
                                <div key={h._id} style={{ ...styles.historyBox, backgroundColor: bg }}>
                                    <div key={h._id} style={styles.historyBoxInner}>
                                        <span style={{ ...styles.examTitle, color: clr }}>{h.exam && h.exam.title}</span>
                                        <span style={{ ...styles.courseTitle, color: clr }}>{h.course && h.course.title}</span>
                                    </div>
                                    <div style={styles.historyBoxDetailBox}>
                                        <span className="text-info" style={styles.pointTxt}>{h.totalPoint} {word[window.language].point}</span>
                                        <Button
                                            onClick={() => this.getExamDetail(h)}
                                            color="info"
                                            style={styles.detailBtn}>
                                            {word[window.language].detail}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                        :
                        this.state.isLoading ?
                            <div style={styles.loadingBox}>
                                <Spinner type="grow" color="warning" style={styles.loading} />
                            </div>
                            :
                            <div style={styles.noResultBox}>
                                <span style={styles.noResultText}>{word[window.language].dontHaveExamHistory}</span>
                            </div>
                    }
                </div>
            </div>
        )
    }
    //////////////////////////////VIEWER//////////////////////////////

    render() {
        if (this.state.redirectHome) {
            return <Redirect push to="/" />;
        }

        if (!this.state.isFoundVideoRef && this.refs && this.refs.player) {
            this.setState({ isFoundVideoRef: true }, () => {
                this.refs.player.subscribeToStateChange(this.handleVideoStateChange.bind(this));
                clearInterval(this.loop)
            })
        }

        return (
            <div className="login loginContainer">
                <SideNav page={'history'} />
                <div className='quizBox'>
                    {this.state.pickedHistory ?
                        this.examDetailView()
                        :
                        this.examPickerView()
                    }
                    <img src={require('../image/decorate02.png')} style={styles.decotateLeft} alt={'decorate02'} />
                    <img src={require('../image/decorate01.png')} style={styles.decotateRight} alt={'decorate01'} />
                </div>
            </div>
        );
    }
}

const styles = {
    loadingContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    loadingBox: { alignSelf: 'center' },
    loading: { width: '3rem', height: '3rem' },
    container: { zIndex: 2, width: '85vw', height: '85vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll', marginLeft: '60px' },
    topic: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px' },
    decotateLeft: { bottom: 0, left: 0, position: 'absolute', width: '25vw', marginLeft: '60px' },
    decotateRight: { bottom: 0, right: 0, position: 'absolute', width: '25vw' },
    box: { display: 'flex', flexDirection: 'column', marginLeft: 10, marginRight: 10, alignItems: 'flex-start' },
    historyBox: { display: 'flex', flexDirection: 'row', width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10 },
    historyBoxInner: { display: 'flex', flexDirection: 'column', width: '100%' },
    historyBoxDetailBox: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
    examTitle: { textAlign: 'left', fontFamily: 'DBH', fontSize: 30 },
    courseTitle: { textAlign: 'left', fontFamily: 'DBH', fontSize: 25, opacity: 0.7 },
    pointTxt: { fontFamily: 'DBH', fontSize: 30, width: 140, textAlign: 'right', marginRight: 10, color: '#2abaf0' },
    detailBtn: { fontFamily: 'DBH', width: 80 },
    noResultBox: { alignSelf: 'center' },
    noResultText: { textAlign: 'center', alignSelf: 'center', color: '#aaa' },
    text: { color: '#000', fontFamily: 'DBH', fontSize: '24px' },
    cutLine: { width: '100%', height: 1, backgroundColor: '#ccc' },
    answerTopicTxt: { color: '#73c4d1', fontFamily: 'DBH', fontSize: '30px', marginLeft: 30 },

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
    diagramDescContainer: { backgroundColor: '#fff', borderTop: '2px solid #ffeb67', paddingTop: 1, paddingBottom: 1 },
    diagramDescBox: { display: 'flex', alignItems: 'center' },
    diagramDescBtn1: { width: '1.5vw', height: '1.5vw', border: '2px solid #337ab7', backgroundColor: '#fff', marginTop: 1, marginBottom: 1, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn2: { width: '1.5vw', height: '1.5vw', backgroundColor: '#96ceb4', marginTop: 1, marginBottom: 1, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn3: { width: '1.5vw', height: '1.5vw', backgroundColor: '#ff6e69', marginTop: 1, marginBottom: 1, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn4: { width: '1.5vw', height: '1.5vw', backgroundColor: '#ffeeae', marginTop: 1, marginBottom: 1, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtn5: { width: '1.5vw', height: '1.5vw', backgroundColor: '#d9d5d5', marginTop: 1, marginBottom: 1, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 },
    diagramDescBtnTxt: { fontFamily: 'DBH', fontSize: '20px', fontWeight: '500', marginTop: 5 },
    quizBox1_4: { alignSelf: 'center', marginBottom: 10, marginLeft: 10, width: '95%', display: 'flex', flexDirection: 'row' },
    closeExamBtn: { width: '100%', height: 50, borderRadius: 25, marginRight: 5, backgroundColor: 'red', borderWidth: 0 },
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
    examContainer: {/* display: 'flex',*/ flex: 1, height: '100%', position: 'relative', flexDirection: 'column', backgroundColor: '#fff', margin: 10, marginTop: 0, border: '2px solid #ff5f6d', borderRadius: 10, overflow: 'hidden' },
    examContainerInner: { overflowY: 'scroll', /*display: 'flex', flex: 1,*/height: '100%', paddingLeft: '10px', width: '100%', flexDirection: 'column', marginTop: '5px' },
    videoExamPlayerContainer: { width: '100%', height: '45vh', marginBottom: 10, marginLeft: 'auto', marginRight: 'auto', marginTop: 5 },
    question: { fontFamily: 'DBH', fontSize: '30px', fontWeight: 500, textAlign: 'left', marginLeft: 10, marginBottom: 10, display: 'flex', color: '#1c5379' },
    answerContainer: { display: 'flex', /*flex: 1,*/ flexWrap: 'wrap', flexDirection: 'row' },
    answerMatchContainer: { display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' },
    answerTextInputBox: { marginLeft: '15px', marginRight: '5px', height: '200px', width: '100%', border: '1px solid #aaa', borderRadius: '5px', padding: 5, marginTop: '10px', marginBottom: '10px', },
    answerTextInput: { textAlign: 'left', height: '100%' },
    answerBtnContainer: { width: '45%', marginBottom: 20, marginLeft: '2.5%', },
    answerContainerInner: { backgroundColor: '#eee', position: 'relative', borderRadius: 30, paddingBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
    answerTxt: { fontFamily: 'DBH', fontWeight: 500, color: '#1c5379', fontSize: '30px' },
    answerContainerFullfill: { display: 'flex', flex: 1 },
    matchBtn: { width: '45%', position: 'relative', justifyContent: 'flex-end', display: 'flex', marginLeft: 'auto', marginRight: 'auto' },
    matchingBtn: { fontFamily: 'DBH', fontSize: '25px', width: '100%', marginBottom: '10px', marginTop: '10px', height: '50px', borderRadius: '25px', marginLeft: 'auto', marginRight: 'auto' },
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

    solutionBox: { width: '90%', border: '2px solid #239822', borderRadius: 20, margin: 'auto', paddingLeft: 10, paddingRight: 10, paddingTop: 5 },
    solutionTopic: { color: '#49c348', textAlign: 'left', fontFamily: 'DBH', fontWeight: 'bold', fontSize: 30, textDecorationLine: 'underline' },
    solutionTxt: { textAlign: 'left', fontFamily: 'DBH', fontWeight: 500, fontSize: 25, marginLeft: 10 },
    answerIco: { fontSize: '30px', position: 'absolute', backgroundColor: '#fff', borderRadius: 30, padding: 2, display: 'flex' },

    votingContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' },
    votingBtn: { width: '200px', marginRight: '5px', height: '50px' },
    votingProgress: { width: '100%', height: '50px' },
}