import React, { Component } from 'react'
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'
import { urlApi } from '../../helper/database';
import { connect } from 'react-redux'
import swal from 'sweetalert';
import io from 'socket.io-client'

class Notification extends Component {
    state = {
        dataNotification: []
    }

    getNotification = () => {
        axios.get(urlApi + 'notification/getnotif/' + this.props.id)
        .then((res) => {
            this.setState({ dataNotification: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'get notification error', 'error')
        })
    }

    renderNotification = () => {
        return this.state.dataNotification.map((val, idx) => {
            return (
                <div key={idx}> 
                    <p><span style={{fontWeight: 'bold'}}>{val.username}</span> {val.message}</p>
                </div>
            )
        })
    }

    componentDidMount() {
        this.getNotification()
        this.socket = io(`${urlApi}`)
        this.socket.on('change-notif', data => {
            this.getNotification()
        })
    }


    render() {
        if(this.props.id == 0) {
            return <Redirect to='/auth'/>
        }
        return (
            <div>
                {this.renderNotification()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        id: state.user.id
    }
}

export default connect(mapStateToProps, {})(Notification);
