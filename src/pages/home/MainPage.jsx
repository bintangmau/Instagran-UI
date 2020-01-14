import React, { Component } from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { urlApi } from '../../helper/database';

import moment from 'moment'
import swal from 'sweetalert';
import ListPhoto from '../../components/ListPhoto'
import './MainPage.css'

class MainPage extends Component {
    state = {
        tampungDataMainPage: [],
        date_likes: moment().startOf('hour').fromNow(),
        likedOrNot: false,
        comment: '',
        listComment : [],
        jumlahLikes: 0
    }

    componentDidMount() {
        this.getDataMainPage()
        this.renderDataMainPage()
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
    
    // getCountLike = () => {
    //     axios.get(urlApi + 'photo/countlike/' + dataListPhoto.idphotos)
    //     .then((res) => {
    //         this.setState({ jumlahLikes: res.data[0].jumlahLikes })
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //         swal('Ups!', 'get gagal', 'error')
    //     })
    // }

    renderDataMainPage = () => {
        return this.state.tampungDataMainPage.map((val) => {
            // this.getListComment(val.idphotos)
            return (
             <div>
                 <ListPhoto dataListPhoto={val} idUser={this.props.id}/>
             </div>
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