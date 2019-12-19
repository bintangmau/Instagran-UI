import React, { Component } from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { urlApi } from '../helper/database';

import moment from 'moment'
import swal from 'sweetalert';
import './MainPage.css'

class MainPage extends Component {
    state = {
        tampungDataMainPage: [],
        date_likes: moment().startOf('hour').fromNow(),
        likedOrNot: false,
        tampungCheckLike: [],
        tampungGetComment: [],
        comment: ''
    }

    componentDidMount() {
        this.getDataMainPage()
        this.renderDataMainPage()
    }

    getDataMainPage = () => {
        axios.get(urlApi + 'photo/getdatamainpage/' + this.props.id)
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

    likePhoto = (idPhoto) => {
        axios.post(urlApi + 'photo/checklikephoto', { idUser: this.props.id, idPhoto})
        .then((res) => {
            if(res.data.length === 0) {
                axios.post(urlApi + 'photo/likephoto', { id_user: this.props.id, id_photo: idPhoto, date_likes: this.state.date_likes})
                .then(() => {
                    this.setState({ likedOrNot: true })
                    this.getDataMainPage()
                })
                .catch((err) => {
                    console.log(err)
                    swal('Ups!', 'Like gagal', 'error')
                })      
            } else {
                swal('Ups', 'Photo Liked', 'warning')
            }
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'getlike gagal', 'error')
        })
    }

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
                <div className='listFoto1'>
                    <div className="listHeader1">
                        <img style={{width: "80px", borderRadius: "50%"}} src="http://daman.co.id/daman.co.id/wp-content/uploads/2017/05/18160966_1300500379997093_1978007820502564864_n-1024x1024.jpg" alt=""/>
                        <p>
                            <Link to={`/otherprofilepage/${val.id}`} style={{textDecoration: 'none', color: 'black'}}>{val.username}</Link>
                        </p>
                    </div>
                    <img src={urlApi + val.path_photo} alt=""/>
                    <div className='listLike1'>
                        <div className="caption1">
                            <span>{val.likes_photo} Likes</span>
                            <i class="fa fa-heart-o" aria-hidden="true"></i>
                            <p>
                                <span><Link to={`/otherprofilepage/${val.id}`} style={{textDecoration: 'none', color: 'black'}}>{val.username}</Link></span> {val.caption}</p> <br />
                            <div className="caption2">
                                    <button onClick={() => this.likePhoto(val.idphotos)}>Like</button>
                            </div>
                            <div className="comment1">
                                <h2>Comment here</h2>
                                <div className="comment2">
                                    <form>
                                        <input type="text" onChange={(e) => this.setState({ comment: e.target.value })} value={this.state.comment}/>
                                        <label>Comment</label>
                                        <span></span>
                                    </form>
                                </div>
                                <button onClick={() => this.onBtnSendComment(val.idphotos)}>Send</button>
                            </div>
                        </div>
                    </div>
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
                {this.renderDataMainPage()}
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