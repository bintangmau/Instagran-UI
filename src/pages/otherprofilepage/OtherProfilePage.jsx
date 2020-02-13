import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom'
import { urlApi } from '../../helper/database';
import { connect } from 'react-redux'
import moment from 'moment'
import swal from 'sweetalert';

import '../profile/ProfilePage.css'

class OtherProfilePage extends Component {
    idFollowedUser = this.props.match.params.id

    state = {
        tampungDataUser: [],
        tampungUserPhoto: [],
        tampungCheckFollowed: [],
        waktu: moment().format("MMM Do YY"),
        countPosts: 0,
        countFollowers: 0,
        countFollowings: 0
    }

    componentDidMount() {
        this.checkFollowed()
        this.getDataUser()
        this.renderDataUser()
        this.getPhotoUser()
        this.renderUserPhoto()
        this.getCountPosts()
        this.getCountFollowers()
        this.getCountFollowings()
    }
    
    componentDidUpdate() {
        this.getDataUser()
    }

    getDataUser = () => {
        Axios.post(urlApi + 'user/getdatauser', { idUser: this.idFollowedUser })
        .then((res) => {
            this.setState({ tampungDataUser: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Sip!', 'gagal disini jancok', 'error')
        })
    }

    getPhotoUser = () => {
        Axios.get(urlApi + 'photo/getuserphoto/' + this.idFollowedUser)
        .then((res) => {
            this.setState({ tampungUserPhoto: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get foto gagal', 'error')
        })
    }

    checkFollowed = () => { 
        Axios.post(urlApi + 'user/checkfollowed', {
            idUserFollows: this.props.id,
            idFollowedUser: this.idFollowedUser
        })
        .then((res) => {
            this.setState({ tampungCheckFollowed: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'gagal', 'error')
        })
    }

    onBtnFollow = () => {
        Axios.post(urlApi + 'user/followinguser', {
            id_user_follows: this.props.id,
            id_followed_user: this.idFollowedUser,
            date_follows: this.state.waktu
        })
        .then(() => {
            Axios.post(urlApi + 'notification/notiffollows', {
                id_fail: this.props.id,
                id_maful: this.idFollowedUser,
                date_notif: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)  + '-' + new Date().getDate(),
                message: 'Mulai mengikuti anda'
            })
            .then(() => {
                this.checkFollowed()
                this.getCountFollowers()
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups', 'follow error', 'error')
        })
    }

    onBtnUnFollow = () => {
        if(window.confirm('Are you Sure to Unfollow this User ?')) {
            Axios.post(urlApi + 'user/unfollow', {
                idUserFollows: this.props.id,
                idFollowedUser: this.idFollowedUser
            })
            .then(() => {
                this.checkFollowed()
                this.getCountFollowers()
            })
            .catch((err) => {
                console.log(err)
                swal('Ups', 'unfollow error', 'error')
            })
        }
    }

    getCountPosts = () => {
        Axios.post(urlApi + 'user/countposts', { idUser: this.props.match.params.id })
        .then((res) => {
            this.setState({ countPosts: res.data[0].jumlahPost })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal count posts', 'error')
        })
    }

    getCountFollowers = () => {
        Axios.post(urlApi + 'user/countfollowers', { idUser: this.props.match.params.id })
        .then((res) => {
            this.setState({ countFollowers: res.data[0].jumlahFollowers })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal count followers', 'error')
        })
    }

    getCountFollowings = () => {
        Axios.post(urlApi + 'user/countfollowings', { idUser: this.props.match.params.id})
        .then((res) => {
            this.setState({ countFollowings: res.data[0].jumlahFollowing })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal count following', 'error')
        })
    }

    renderDataUser = () => {
        return this.state.tampungDataUser.map((val) => {
            return (
            <div className='profile1 row'>
                <div className="col-md-4">
                    <img src={urlApi + val.photo} alt="" />
                </div>
                <div className="col-md-8">
                    <div className='profile2'>
                        <div className="profile4">
                            <div className="row">
                                <div className="col-md-3">
                                    <h4 style={{marginTop: '15px', fontWeight: 'bold'}}>{val.username}</h4>
                                </div>
                                <div className="col-md-9">
                                    {
                                        this.state.tampungCheckFollowed.length > 0
                                        ?
                                        <button className='btn btn-dark' onClick={this.onBtnUnFollow}>Followed</button>
                                        :
                                        <button className='btn btn-success' onClick={this.onBtnFollow}>Follow</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="profile3" style={{marginTop: "20px"}}>
                            <p><span>{this.state.countPosts}</span> Posts</p>
                            <Link to={`/followers/${this.props.match.params.id}`}>
                                <p style={{marginLeft: '30px', color: 'black'}}><span>{this.state.countFollowers}</span> Followers</p>
                            </Link>
                            <Link to={`/followings/${this.props.match.params.id}`}>
                                <p style={{marginLeft: '30px', color: 'black'}}><span>{this.state.countFollowings}</span> Following</p>
                            </Link>
                        </div>
                        <p>{val.name}</p>
                    </div>
                </div>
            </div>
            )
        })
    }

    renderUserPhoto = () => {
        return this.state.tampungUserPhoto.map((val) => {
            return (
                <div className='fotoOrang col-md-3'>
                    <Link to={`/otherdetailsphoto/${val.idphotos}`}>
                        <img src={urlApi + val.path_photo} alt=""/>
                    </Link>
                </div>
            )
        })
    }

    render() {
        return (
            <div style={{marginBottom: '100px'}}>
                <div className="container">
                    {this.renderDataUser()}
                    <div className='row' style={{marginTop: '50px'}}>
                        {this.renderUserPhoto()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.user.id
    }
}

export default connect(mapStateToProps)(OtherProfilePage);