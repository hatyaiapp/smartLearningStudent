import React, { Component } from 'react';
import '../App.css';
import { Button, Form, FormGroup, Input, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Alert } from 'reactstrap';
import { faHome, faUser, faClock, faFileAlt, faCalendarAlt, faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Test extends Component {
    constructor() {
        super();
        this.state = {
            type: 'student',
            data: [],
            current: 0,
            answer: [],
            timer: 900,
            isTimeOut: false,
            isStart: false
        }
    }

    componentDidMount() {
        fetch('http://dev.hatyaiapp.com:11948/exam/5c60ffccb0d86070582148d7/questions')
            .then(res => res.json())
            .then(qstn => {
                this.setState({ data: qstn })
            })
    }

    componentWillUnmount() {
        clearInterval(this.clockCall);
    }

    start() {
        this.setState({ isStart: true }, () => {
            this.clockCall = setInterval(() => {
                this.decrementClock();
            }, 1000);
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
        for (let i in this.state.data) {
            if (this.state.answer[i] == undefined) {
                return false
            }
        }
        return true
    }

    render() {
        return (
            <div className="login loginContainer">
                <div className='loginBox'>
                    {!this.state.isStart ?
                        <div style={{ width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <p style={{ color: '#ff5f6d', fontFamily: 'DBH', fontSize: 60 }}>แบบทดสอบ ก</p>
                            <p style={{ color: '#555', fontFamily: 'DBH', fontSize: 30 }}>เวลาทำข้อสอบ: <span style={{ color: '#337ab7', fontFamily: 'DBH', fontSize: 30 }}>{this.getTimeTxt(900)} นาที</span></p>
                            <Button onClick={() => this.start()} style={{ width: 400, height: 60, background: '#ffe00f', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#000', fontWeight: 'bolder', fontSize: 30 }}>เริ่มทำข้อสอบ</span>
                                <FontAwesomeIcon icon={faCaretRight} style={{ width: 30, fontSize: 25, color: '#000' }} />
                            </Button>
                        </div>
                        :
                        <div style={{ width: '80vw', height: '80vh', backgroundColor: '#fff', alignSelf: 'center', borderRadius: 20, display: 'flex', flexDirection: 'row' }}>
                            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#98def8', margin: 10, border: '2px solid #23b8f0', borderRadius: 10, overflow: 'hidden' }}>
                                    <p style={{ fontFamily: 'DBH', color: '#1c5379', alignSelf: 'center', fontSize: 25, height: 20, fontWeight: 500 }}>ยินดีต้อนรับ</p>
                                    <div style={{ backgroundColor: '#fff', flex: 1 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesomeIcon icon={faUser} style={{ width: 30 }} />
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: 25 }}>: John Doe</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesomeIcon icon={faClock} style={{ width: 30 }} />
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: 25 }}>: {this.getTimeTxt(900)}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesomeIcon icon={faFileAlt} style={{ width: 30 }} />
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: 25 }}>: แบบทดสอบ ก</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', margin: 10, border: '2px solid #44b29c', borderRadius: 10, overflow: 'hidden' }}>
                                    <div style={{ backgroundColor: '#b3e0d7', display: 'flex', flexDirection: 'column', alignSelf: 'center', paddingLeft: 25, paddingRight: 25, margin: 5, borderRadius: 10 }}>
                                        <span style={{ fontFamily: 'DBH', fontWeight: 500, fontSize: 25, color: '#1c5379' }}>จับเวลาถอยหลัง</span>
                                        <span style={{ fontFamily: 'DBH', fontWeight: "bold", fontSize: 45, color: '#1c5379', marginTop: -10 }}>{this.state.timer === 0 ? 'Times Up!' : this.getTimeTxt(this.state.timer)}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff29e', margin: 10, border: '2px solid #ffeb67', borderRadius: 10, overflow: 'hidden' }}>
                                    <p style={{ fontFamily: 'DBH', color: '#1c5379', alignSelf: 'center', fontSize: 25, height: 20, fontWeight: 500 }}><FontAwesomeIcon icon={faCalendarAlt} style={{ width: 30 }} />แผนผังข้อสอบ</p>
                                    <div style={{ backgroundColor: '#fff', flex: 1, }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}>
                                            {this.state.data.map((d, index) => {
                                                return (
                                                    <Button onClick={() => this.setState({ current: index })} style={{ width: 25, height: 25, border: this.state.current == index ? '2px solid #337ab7' : '2px solid transparent', backgroundColor: this.state.answer[index] != undefined ? '#44b29c' : '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0 }}>
                                                        <p style={{ fontSize: 20, fontFamily: 'DBH', fontWeight: 500, color: '#000', marginTop: -5 }}>{index + 1}</p>
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                        <div style={{ marginTop: 50 }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: 25, height: 25, border: '2px solid #337ab7', backgroundColor: '#fff', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 }} />
                                                <span style={{ fontFamily: 'DBH', fontSize: 18, fontWeight: '500', marginTop: 5 }}>ข้อปัจจุบัน</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: 25, height: 25, backgroundColor: '#44b29c', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 }} />
                                                <span style={{ fontFamily: 'DBH', fontSize: 18, fontWeight: '500', marginTop: 5 }}>ข้อที่ทำแล้ว</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: 25, height: 25, backgroundColor: '#d9d5d5', marginTop: 2, marginLeft: 2, padding: 0, borderRadius: 3, marginRight: 5 }} />
                                                <span style={{ fontFamily: 'DBH', fontSize: 18, fontWeight: '500', marginTop: 5 }}>ข้อที่ยังไม่ได้ทำ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 4 }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h1 style={{ fontFamily: 'DBH', fontWeight: 'bolder', color: '#ff5f6d', fontSize: 55, textAlign: 'left', margin: 10, marginLeft: 50 }}>ข้อที่ {this.state.current + 1} จาก {this.state.data.length}</h1>
                                    {!this.isFinish() ?
                                        <Button disabled onClick={() => null} style={{ width: 200, height: 60, background: '#aaa', marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, marginRight: 10 }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontWeight: 'bolder', fontSize: 30 }}>ส่งข้อสอบ</span>
                                            <FontAwesomeIcon icon={faCaretRight} style={{ width: 30, fontSize: 25 }} />
                                        </Button>
                                        :
                                        <Button onClick={() => alert('ส่งข้อสอบ')} style={{ width: 200, height: 60, background: '#ffe00f', marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, marginRight: 10 }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#000', fontWeight: 'bolder', fontSize: 30 }}>ส่งข้อสอบ</span>
                                            <FontAwesomeIcon icon={faCaretRight} style={{ width: 30, fontSize: 25, color: '#000' }} />
                                        </Button>
                                    }
                                </div>
                                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: '#fff', margin: 10, border: '2px solid #ff5f6d', borderRadius: 10, overflow: 'hidden' }}>
                                    <span style={{ fontFamily: 'DBH', fontSize: 32, fontWeight: 500, textAlign: 'left', marginLeft: 10, marginBottom: 20, color: '#1c5379' }}>
                                        {this.state.data[this.state.current] && this.state.data[this.state.current].text}
                                    </span>
                                    <div style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', }}>
                                        {this.state.data[this.state.current] && this.state.data[this.state.current].choices.map((c, index) => {
                                            return (
                                                <Button
                                                    onClick={() => {
                                                        if (this.state.answer[this.state.current] == index) {
                                                            this.state.answer[this.state.current] = undefined
                                                            this.forceUpdate()
                                                        }
                                                        else {
                                                            this.state.answer[this.state.current] = index
                                                            console.log(this.state.current, this.state.data.length - 1)
                                                            if (this.state.current < this.state.data.length - 1) {
                                                                this.setState({ current: this.state.current + 1 })
                                                            }
                                                            else {
                                                                this.forceUpdate()
                                                            }
                                                        }
                                                    }}
                                                    style={{ width: '45%', height: 60, backgroundColor: this.state.answer[this.state.current] === index ? '#2abaf0' : '#fff', border: '2px solid #2abaf0', marginTop: 20, marginLeft: index % 2 === 1 ? '2.5%' : '0%', padding: 0, borderRadius: 30 }}
                                                >
                                                    <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#1c5379', fontWeight: 'bolder', fontSize: 30 }}>{c.text}</span>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                    {this.state.current > 0 ?
                                        <Button onClick={() => this.setState({ current: this.state.current - 1 })} style={{ width: 200, height: 60, background: '#f1673e', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                            <FontAwesomeIcon icon={faCaretLeft} style={{ width: 30, fontSize: 25 }} />
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontWeight: 'bolder', fontSize: 30 }}>ย้อนกลับ</span>
                                        </Button>
                                        :
                                        <Button disabled onClick={() => null} style={{ width: 200, height: 60, background: '#aaa', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                            <FontAwesomeIcon icon={faCaretLeft} style={{ width: 30, fontSize: 25 }} />
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontWeight: 'bolder', fontSize: 30 }}>ย้อนกลับ</span>
                                        </Button>
                                    }
                                    {this.state.current !== (this.state.data.length - 1) ?
                                        <Button onClick={() => this.setState({ current: this.state.current + 1 })} style={{ width: 200, height: 60, background: '#f1673e', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontWeight: 'bolder', fontSize: 30 }}>ถัดไป</span>
                                            <FontAwesomeIcon icon={faCaretRight} style={{ width: 30, fontSize: 25 }} />
                                        </Button>
                                        :
                                        <Button disabled onClick={() => null} style={{ width: 200, height: 60, background: '#aaa', marginTop: 2, marginLeft: 2, borderWidth: 0, padding: 0, borderRadius: 30, margin: 10, alignSelf: "center" }}>
                                            <span style={{ fontFamily: 'DBH', fontWeight: 500, color: '#fff', fontWeight: 'bolder', fontSize: 30 }}>ถัดไป</span>
                                            <FontAwesomeIcon icon={faCaretRight} style={{ width: 30, fontSize: 25 }} />
                                        </Button>
                                    }
                                </div>

                            </div>
                        </div>
                    }
                    <img src={require('../image/decorate02.png')} style={{ bottom: 0, left: 0, position: 'absolute' }} />
                    <img src={require('../image/decorate01.png')} style={{ bottom: 0, right: 0, position: 'absolute' }} />
                </div>
            </div>
        );
    }
}
export default Test;