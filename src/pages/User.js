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
        uploadImg:'อัพโหลดรูปภาพ',
        cancel: 'ยกเลิก',
        save:'บันทึก'
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
        uploadImg:'Upload',
        cancel: 'Cancel',
        save:'Save'
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
            file: null,
            editedName: '',
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
                this.setState({ isLoading: false, user, editedName: user.name })
            })
    }

    getTeacherText(data) {
        let txt = ''
        for (let i in data) {
            txt += (data[i].name + ', ')
        }
        return txt.slice(0, -2)
    }

    onChange(e) {
        if (e.target && e.target.files && e.target.files[0]) {
            this.setState({
                file: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    isEdited(){
        if(this.state.file || this.state.user.name !== this.state.editedName){
            return true
        }
        return false
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
                        <div style={styles.userImgBox}>
                            {this.state.file ?
                                <img src={this.state.file} style={styles.userImg} alt={'user'} />
                                :
                                <img src={require('../image/user.png')} style={styles.userImg} alt={'user'} />
                            }
                        </div>
                        <div style={{ ...styles.uploadImgBtn, backgroundColor: this.state.file ? 'red' : 'gold' }}
                            onClick={() => {
                                this.state.file ?
                                    this.setState({ file: null }, () => this.refs.userProfile.value = '')
                                    :
                                    this.refs.userProfile.click()
                            }}
                        >
                            <span style={styles.text}>{!this.state.file ? word[window.language].uploadImg : word[window.language].cancel}</span>
                        </div>
                        <input style={{ width: '0px' }} ref={'userProfile'} type="file" name="userProfile" onChange={(e) => this.onChange(e)} />
                        <div style={styles.detailTxtBox}>
                            <p style={styles.detailTxt}>
                                <span style={styles.detailTopic}>{word[window.language].name}:</span>{' '}
                                {!this.state.isEditName ?
                                    this.state.user && this.state.user.name
                                    :
                                    <input type={'text'} value={this.state.editedName} onChange={(e) => this.setState({ editedName: e.target.value })} />
                                }
                            </p>
                            <div style={{ ...styles.detailTxtEditBtn, backgroundColor: this.state.isEditName ? 'red' : 'gold' }} onClick={() => this.setState({ isEditName: !this.state.isEditName, editedName: this.state.user && this.state.user.name })}>
                                <i className={!this.state.isEditName ? "fa fa-fw fa-pencil" : "fa fa-fw fa-close"} style={styles.ico} />
                            </div>
                        </div>
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].room}:</span> {word[window.language].m}{this.state.user && this.state.user.grade}/{this.state.user && this.state.user.room}</p>
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].school}:</span> {this.state.user && this.state.user.school && this.state.user.school.name}</p>
                        <p style={styles.detailTxt}><span style={styles.detailTopic}>{word[window.language].advisors}:</span> {this.state.user && this.state.user.teachers && this.getTeacherText(this.state.user.teachers)}</p>
                        <Button color={'success'} style={styles.saveBtn} disabled={!this.isEdited()}>
                            <span>{word[window.language].save}</span>
                        </Button>
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
    container: { zIndex: 2, position: 'static', width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'scroll',marginLeft:'60px' },
    text: {fontFamily: 'DBH',},
    topicTxt: { color: '#ff5f6d', fontFamily: 'DBH', fontSize: '45px' },
    detailTxt: { color: '#222', fontFamily: 'DBH', fontSize: '30px', alignSelf: 'flex-start', marginLeft: 20 },
    detailTxtEditBtn: { width: '30px', height: '30px', borderWidth: '0px', borderStyle: 'solid', backgroundColor: 'gold', borderRadius: '15px', cursor: 'pointer', marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' },
    detailTxtBox: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '35px' },
    detailTopic: { color: '#999' },
    decorateLeft: { bottom: 0, left: 0, position: 'absolute', width: '25vw',marginLeft:'60px' },
    decorateRight: { bottom: 0, right: 0, position: 'absolute', width: '25vw' },
    userImgBox: { display: 'flex', width: '100px', height: '100px', marginLeft: 'auto', marginRight: 'auto', },
    userImg: { width: '100px', height: '100px', borderRadius: '50px' },
    uploadImgBtn: {width:'100px',marginLeft:'auto',marginRight:'auto',marginTop:'5px',borderRadius:'10px',cursor:'pointer'},
    ico: { fontSize: '1em', margin: '0px' },
    saveBtn:{marginBottom:'20px',marginTop:'auto',marginLeft:'20px',marginRight:'10px'},
}