import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Media } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav from '../_component/sideNav'

let word = {
    th: {
        personalInfo: 'ข้อมูลส่วนตัว',
        name: 'ชื่อ',
        room: 'ห้อง',
        school: 'โรงเรียน',
        advisors: 'อาจารย์ที่ปรึกษา/ครูประจำชั้น',
        m: 'ม.',
        stopExam: 'หยุดทำข้อสอบ',
        confirmStopExamTxt: 'คุณต้องการยกเลิกการทำข้อสอบหรือไม่ ข้อมูลข้อสอบชุดนี้จะถูกบันทึกว่า "ไม่ได้ทำการส่งข้อสอบ"',
        cancel: 'ยกเลิก'
    },
    en: {
        personalInfo: 'Personal Infomation',
        name: 'Name',
        room: 'Room',
        school: 'School',
        advisors: 'Advisors',
        m: 'M.',
        stopExam: 'Stop exam',
        confirmStopExamTxt: 'Do you want to cancel the exam? This Answersheet will be recorded as "Did not send the answers"',
        cancel: 'Cancel'
    }
}

export default class User extends Component {
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
        }
    }

    componentDidMount() {
        console.log('cdm')
        fetch('http://student.questionquick.com/profile',
            {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(user => {
                console.log("user", user)
                this.setState({ isLoading: false, user })
            })
    }

    getTeacherText(data) {
        let txt = ''
        for (let i in data) {
            txt += (data[i].name + ', ')
        }
        return txt.slice(0, -2)
    }

    render() {
        return (
            <div className="login loginContainer">
                <SideNav page={'user'} />
                {this.state.isLoading ?
                    <div style={styles.spinnerContainer}>
                        <Spinner type="grow" color="warning" style={styles.spinner} />
                    </div>
                    :
                    null
                }
                <div className='quizBox'>
                    <div style={styles.container}>
                        <p style={styles.topicTxt}>{word[window.language].personalInfo}</p>
                        <img src={require('../image/user.png')} style={styles.userImg} alt={'user'} />
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].name}:</span> {this.state.user && this.state.user.name}</p>
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].room}:</span> {word[window.language].m}{this.state.user && this.state.user.grade}/{this.state.user && this.state.user.room}</p>
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].school}:</span> {this.state.user && this.state.user.school && this.state.user.school.name}</p>
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].advisors}:</span> {this.state.user && this.state.user.teachers && this.getTeacherText(this.state.user.teachers)}</p>
                    </div>
                    <img src={require('../image/decorate02.png')} style={styles.decorateLeft} alt={'decorate02'} />
                    <img src={require('../image/decorate01.png')} style={styles.decorateRight} alt={'decorate01'} />
                </div>
                <Modal isOpen={this.state.quizModal} toggle={() => this.setState({ quizModal: false })}>
                    <ModalHeader toggle={() => this.setState({ quizModal: false }, () => alert(word[window.language].stopExam))}>{word[window.language].stopExam} ?</ModalHeader>
                    <ModalBody>
                        {word[window.language].confirmStopExamTxt}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.setState({ quizModal: false }, () => window.history.go(0))}>{word[window.language].stopExam}</Button>{' '}
                        <Button color="secondary" onClick={() => this.setState({ quizModal: false })}>{word[window.language].cancel}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const styles = {
    spinnerContainer: { display: 'flex', flex: 1, backgroundColor: '#000', opacity: '0.5', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    spinner: { width: '3rem', height: '3rem' },
    container: { zIndex: 2, width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll' },
    topicTxt: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '4vw' },
    detailTxt: { color: '#222', fontFamily: 'DBH', fontSize: '2vw', alignSelf: 'flex-start', marginLeft: 20 },
    detailTopic: { color: '#999' },
    decorateLeft: { bottom: 0, left: 0, position: 'absolute', width: '25vw' },
    decorateRight: { bottom: 0, right: 0, position: 'absolute', width: '25vw' },
    userImg: { width: '100px', height: '100px', borderRadius: '50px', marginLeft: 'auto', marginRight: 'auto' }
}