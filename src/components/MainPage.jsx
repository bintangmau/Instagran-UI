import React, { Component } from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { urlApi } from '../helper/database';

import moment from 'moment'
import swal from 'sweetalert';
import './MainPage.css'
import ListPhoto from './ListPhoto'

class MainPage extends Component {
    state = {
        tampungDataMainPage: [],
        date_likes: moment().startOf('hour').fromNow(),
        likedOrNot: false,
        comment: ''
    }

    componentDidMount() {
        this.getDataMainPage()
    }

    getDataMainPage = () => {
        axios.get(urlApi + 'photo/getmainfollowedonly/' + this.props.id)
        .then((res) => {
            this.setState({ tampungDataMainPage: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'Get Gagal', 'error')
        })
    }

    // getCommentMainPage = (idUser, idPhoto) => {
    //     axios.post(urlApi + 'photo/getcommentmainpage', {idUser, idPhoto})
    //     .then((res) => {
    //         this.setState({ tampungComment: res.data })
    //         swal('Ye!', 'getbisa', 'success')
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //         swal('Ups!', 'getgagal', 'error')
    //     })
    // }


    

    onBtnSendComment = (idPhoto) => {
        if(this.state.comment === '') {
            swal('Ups!', 'Input Comment', 'warning')
        } else {
            axios.post(urlApi + 'photo/commentphoto', {
                comment: this.state.comment,
                id_user_comment: this.props.id,
                id_photo_comment: idPhoto,
                date_comment: this.state.date_likes
            })
            .then(() => {
                this.setState({ comment: ''})
                swal('Ye!', 'commentbisa', 'success')
            })
            .catch((err) => {
                console.log(err)
                swal('Ups!', 'Comment Failed', 'error')
            })
        }
    }
    
    renderDataMainPage = () => {
        return this.state.tampungDataMainPage.map((val) => {
            return (
                <ListPhoto dataListPhoto={val} sendCommentBtn={this.onBtnSendComment} idUser={this.props.id}/>
            )
        })
    }

    render() {
        if(this.props.username === '') {
            return <Redirect to='/auth'/>
        }
        return (
            <div>
                {
                    this.state.tampungDataMainPage.length
                    ?
                    this.renderDataMainPage()
                    :
                    null
                }
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

export default connect(mapStateToProps)(MainPage); 