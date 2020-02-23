import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { urlApi } from '../../helper/database'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import { MDBFormInline } from "mdbreact"
import io from 'socket.io-client'

class DirectMessage extends Component {
    state = {
        inputMessage: '',
        tampungHasilCari: [],
        listFriends: [],
        idUserChoosed: 0,
        dataChatsFromMe: [],
        dataChatsForMe: [],
        usernameFriend: '',
        photoFriend: '',
        loading: false,
        showChat: false ,
        keyWords: ''
    }
    
    onBtnSendMessage = () => {
        if(!this.state.inputMessage) {
            return null
        } else {
            this.setState({ loading: true })
            axios.post(urlApi + 'chats/sendmessage', {
                chats: this.state.inputMessage,
                id_sender: this.props.id,
                id_receiver: this.state.idUserChoosed,
                date_chats: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)  + '-' + new Date().getDate(),
                status: 'D'
            })
            .then(() => {
                this.setState({ loading: false, inputMessage: '' })
                this.getDataChatsFromMe(this.state.idUserChoosed)
            })
            .catch((err) => {
                this.setState({ loading: false, inputMessage: '' })
                console.log(err)
            })
        }
    }

    getListFriends = () => {
        axios.get(urlApi + 'chats/getlistfriends/' + this.props.id)
        .then((res) => {
            this.setState({ listFriends: res.data })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getDataChatsFromMe = (idReceiver) => {
        axios.post(urlApi + 'chats/getchatsfromme', { idReceiver, idSender: this.props.id })
        .then((res) => {
            this.setState({ dataChatsFromMe: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Ye!', 'ga dapet', 'error')
        })
    }

    getDataChatsForMe = (idSender) => {
        axios.post(urlApi + 'chats/getchatsfromme', { idReceiver: this.props.id, idSender })
        .then((res) => {
            this.setState({ dataChatsForMe: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'Get chat failed', 'error')
        })
    }

    getUsername = (idSender) => {
        axios.post(urlApi + 'chats/getusername' , { idReceiver: this.props.id, idSender })
        .then((res) => {
            this.setState({ usernameFriend: res.data[0].username, photoFriend: res.data[0].photo })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getIdUserChecked = (e) => {
        this.setState({ idUserChoosed: e, showChat: true })
        this.getDataChatsFromMe(e)
        this.getDataChatsForMe(e)
        this.getUsername(e)
    }

    renderListFriends = () => {
        return this.state.listFriends.map((val, idx) => {
            return (
                <div className='shadow' style={{padding: '30px', display: 'flex'}}>
                    <img src={urlApi + val.photo} style={{width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover'}} alt=""/>
                    <Link onClick={() => this.getIdUserChecked(val.id_followed_user)}>
                        <p style={{margin: '20px', fontWeight: 'bold'}}>{val.username}</p>
                    </Link>
                </div>
            )
        })
    }

    renderChatsFromMe = () => {
        return this.state.dataChatsFromMe.map((val, idx) => {
            return (
                <div className='row' key={idx} style={{ padding: '25px', backgroundColor: '#ccffcc', margin: '20px', height: '20px', borderRadius: '20px', display: 'flex'}}>
                    <p style={{ fontWeight: 'bold' }}>{val.chats}</p>
                    <p style={{float: 'right', marginLeft: '100px'}}>
                        {val.status}
                    </p>
                </div>
            )
        })
    }

    renderChatsForMe = () => {
        return this.state.dataChatsForMe.map((val, idx) => {
            return (
                <div key={idx} className='row'>
                    <p style={{fontWeight: 'bold'}}>{val.chats}</p>
                </div>
            )
        })
    }

    searchUser = () => {
        axios.post(urlApi + 'chats/searchuser', { username: this.state.keyWords, namaUser: this.props.username })
        .then((res) => {
            this.setState({ tampungHasilCari: res.data, showHasilCari: true })
            // console.log(res.data.length)
        })
        .catch((err) => {
            console.log(err)
            swal('Ups1')
        })    
    }

    renderHasilCari = () => {
        return this.state.tampungHasilCari.map((val) => { 
            return (
                <div className='shadow' style={{padding: '30px', display: 'flex'}}>
                    <img src={urlApi + val.photo} style={{width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover'}} alt=""/>
                    <Link onClick={() => this.getIdUserChecked(val.id_followed_user)}>
                        <p style={{margin: '20px', fontWeight: 'bold'}}>{val.username}</p>
                    </Link>
                </div>
            )
        })
    }

    componentDidMount() {
        this.getListFriends()
        this.socket = io(`${urlApi}`)
        this.socket.on('get-chats',data=>{ // menunggu dr server
            this.getDataChatsForMe(this.state.idUserChoosed)
            this.getDataChatsFromMe(this.state.idUserChoosed)
        })
        this.socket.on('change-status', data => {
            this.getDataChatsFromMe(this.state.idUserChoosed)
        })
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-4" style={{ padding: '27px'}}>
                                    <h3 style={{fontWeight: '500', color: '#336699'}}>Groups</h3>
                                </div>
                                <div className="col-md-8" style={{  padding: '27px'}}>
                                    <h3 style={{fontWeight: '500', color: '#336699'}}>Friends</h3>
                                    <MDBFormInline className="md-form">
                                    {/* <MDBIcon icon="search" /> */}
                                        <input className="form-control form-control-sm ml-3 w-75" value={this.state.keyWords} onChange={(e) => this.setState({ keyWords: e.target.value })} 
                                        type="text" placeholder="Search" aria-label="Search" onKeyUp={this.searchUser} />
                                    </MDBFormInline>
                                    {this.renderHasilCari()}
                                    {this.renderListFriends()}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            {/* HEADER CHAT */}
                            <div className='shadow' style={{ height: '100px', paddingTop: '32px', display: 'flex', padding: '20px'}}>
                                {
                                    this.state.showChat
                                    ?
                                    <>
                                        <img src={urlApi + this.state.photoFriend} style={{width: '70px', height: '70px', borderRadius: '50%'}} alt=""/>
                                        <h3 style={{fontWeight: '500', color: '#336699', margin: '20px'}}>{this.state.usernameFriend}</h3>
                                    </>
                                    :
                                    null
                                }
                            </div>
                            <div className="md-form form-lg" style={{display: 'flex', margin: '20px'}}>
                                {
                                    !this.state.showChat
                                    ?
                                    null
                                    :
                                    <>
                                    <input type="text" value={this.state.inputMessage} className="form-control" placeholder='Masukkan Pesan' onChange={(e) => this.setState({ inputMessage: e.target.value })}/>
                                    {
                                        this.state.loading
                                        ?
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        :
                                        <button className='btn btn-success' style={{width: '200px', marginLeft: '20px'}} onClick={this.onBtnSendMessage}>Send</button>
                                    }
                                    <button className='btn btn-danger' onClick={() => this.setState({ showChat: false })}>Cancel</button>
                                    </>
                                }
                            </div>
                            <div className="row">
                                {
                                    this.state.showChat
                                    ?
                                    <>
                                    <div className='col-md-6'>
                                        {this.renderChatsForMe()}
                                    </div>
                                    <div className="col-md-6">
                                        {this.renderChatsFromMe()}
                                    </div>
                                    </>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        id: state.user.id
    }
}

export default connect(mapStateToProps, {})(DirectMessage);