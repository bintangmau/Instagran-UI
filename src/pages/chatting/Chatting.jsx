import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { urlApi } from '../../helper/database'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'

import './Chatting.scss'

class Chatting extends Component {
    state = {
        inputMessage: '',
        listFriends: [],
        idUserChoosed: 0,
        dataChatsFromMe: [],
        dataChatsForMe: [],
        usernameFriend: '',
        photoFriend: '',
        loading: false,
        showChat: false 
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
                <div className="friend-drawer friend-drawer--onhover">
                    <img className="profile-image"src={urlApi + val.photo} alt="" />
                        <div className="text">
                        <h6>{val.username}</h6>
                        <p className="text-muted">Hey, you're arrested!</p>
                        </div>
                    <span className="time text-muted small">13:21</span>
                </div>
            )
        })
    }

    renderChatsFromMe = () => {
        return this.state.dataChatsFromMe.map((val, idx) => {
            return (
                <div className="no-gutters" key={idx}>
                    <div className="col-md-3">
                      <div className="chat-bubble chat-bubble--left">
                        {val.chats}
                      </div>
                    </div>
                  </div>
            )
        })
    }

    renderChatsForMe = () => {
        return this.state.dataChatsForMe.map((val, idx) => {
            return (
                <div key={idx}>
                    <p style={{fontWeight: 'bold'}}>{val.chats}</p>
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
            <div className="container">
            <div className="row no-gutters">

                {/* FRIEND BAR */}
              <div className="col-md-4 border-right">
                <div className="settings-tray">
                  <img className="profile-image" src={urlApi + this.props.photo} style={{objectFit: 'cover'}} alt="Profile img" />
                  <span className="settings-tray--right">
                    <i className="material-icons">cached</i>
                    <i className="material-icons">message</i>
                    <i className="material-icons">menu</i>
                  </span>
                </div>
                <div className="search-box">
                  <div className="input-wrapper">
                    <i className="material-icons">search</i>
                    <input placeholder="Search here" type="text" />
                  </div>
                </div>
                
                {/* FRIEND LIST */}
                <div className="friend-drawer friend-drawer--onhover">
                  <img className="profile-image" src="https://clarity-enhanced.net/wp-content/themes/clarity-enhanced/assets/img/bootstrap-chat-app-assets/robocop.jpg" alt="" />
                  <div className="text">
                    <h6>Robo Cop</h6>
                    <p className="text-muted">Hey, you're arrested!</p>
                  </div>
                  <span className="time text-muted small">13:21</span>
                </div>
                {this.renderListFriends()}
                <hr />
              </div>

              {/* CHAT BAR */}
              <div className="col-md-8">
                <div className="settings-tray">
                  <div className="friend-drawer no-gutters friend-drawer--grey">
                    <img className="profile-image" src="https://clarity-enhanced.net/wp-content/themes/clarity-enhanced/assets/img/bootstrap-chat-app-assets/robocop.jpg" alt="" />
                    <div className="text">
                      <h6>Robo Cop</h6>
                      <p className="text-muted">Layin' down the law since like before Christ...</p>
                    </div>
                    <span className="settings-tray--right">
                      <i className="material-icons">cached</i>
                      <i className="material-icons">message</i>
                      <i className="material-icons">menu</i>
                    </span>
                  </div>
                </div>
                <div className="chat-panel">
                  <div className="row no-gutters">
                    <div className="col-md-3">
                      <div className="chat-bubble chat-bubble--left">
                        Hello dude!
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters">
                    <div className="col-md-3 offset-md-9">
                      <div className="chat-bubble chat-bubble--right">
                        Hello dude!
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters">
                    <div className="col-md-3 offset-md-9">
                      <div className="chat-bubble chat-bubble--right">
                        Hello dude!
                      </div>
                    </div>
                  </div>
                  {this.renderChatsFromMe()}
                  
                    {/* SEND BAR */}
                  <div className="row">
                    <div className="col-12">
                      <div className="chat-box-tray">
                        <i className="material-icons">sentiment_very_satisfied</i>
                        <input type="text" placeholder="Type your message here..." />
                        <i className="material-icons">mic</i>
                        <i className="material-icons">send</i>
                      </div>
                    </div>
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
        id: state.user.id,
        photo: state.user.photo
    }
}

export default connect(mapStateToProps, {})(Chatting);