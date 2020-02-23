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
        countFollowings: 0,
        loadingFollow: false
    }

    getDataUser = () => {
        Axios.post(urlApi + 'user/getdatauser', { idUser: this.idFollowedUser })
        .then((res) => {
            this.setState({ tampungDataUser: res.data })
        })
        .catch((err) => {
           return null
        })
    }

    getPhotoUser = () => {
        Axios.get(urlApi + 'photo/getuserphoto/' + this.idFollowedUser)
        .then((res) => {
            this.setState({ tampungUserPhoto: res.data })
        })
        .catch((err) => {
            return null
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
            return null
        })
    }

    onBtnFollow = () => {
        this.setState({ loadingFollow: true })
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
                this.setState({ loadingFollow: false })
                this.checkFollowed()
                this.getCountFollowers()
            })
            .catch((err) => {
                this.setState({ loadingFollow: false })
            })
        })
        .catch((err) => {
            swal('Ups', 'follow error', 'error')
        })
    }

    onBtnUnFollow = () => {
        if(window.confirm('Are you Sure to Unfollow this User ?')) {
            this.setState({ loadingFollow: true })
            Axios.post(urlApi + 'user/unfollow', {
                idUserFollows: this.props.id,
                idFollowedUser: this.idFollowedUser
            })
            .then(() => {
                this.checkFollowed()
                this.getCountFollowers()
                this.setState({ loadingFollow: false })
            })
            .catch((err) => {
                this.setState({ loadingFollow: false })
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
            return null
        })
    }

    getCountFollowers = () => {
        Axios.post(urlApi + 'user/countfollowers', { idUser: this.props.match.params.id })
        .then((res) => {
            this.setState({ countFollowers: res.data[0].jumlahFollowers })
        })
        .catch((err) => {
            return null
        })
    }

    getCountFollowings = () => {
        Axios.post(urlApi + 'user/countfollowings', { idUser: this.props.match.params.id})
        .then((res) => {
            this.setState({ countFollowings: res.data[0].jumlahFollowing })
        })
        .catch((err) => {
            return null
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
                                        this.state.tampungCheckFollowed.length == 0
                                        ?
                                        <div>
                                            {
                                                this.state.loadingFollow
                                                ?
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>                       
                                                </div>
                                            :
                                            <button className='btn btn-success' onClick={this.onBtnFollow}>Follow</button>
                                            }
                                        </div>
                                        :
                                        <div>
                                            {
                                                this.state.loadingFollow
                                                ?
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>                       
                                                </div>
                                            :
                                            <button className='btn btn-dark' onClick={this.onBtnUnFollow}>Followed</button>
                                            }
                                        </div>
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

    componentDidMount() {
        console.log(this.state.countPosts)
        this.getDataUser()
        this.getPhotoUser()
        this.getCountPosts()
        this.getCountFollowers()
        this.getCountFollowings()
        this.checkFollowed()
    }

    componentDidUpdate() {
        this.getDataUser()
    }

    render() {
        if(this.state.tampungDataUser.length < 1 && this.state.tampungCheckFollowed < 1 && this.state.tampungUserPhoto.length < 1) {
            return (
                <center>
                    <div style={{marginTop: '100px'}} className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>                       
                    </div>
                </center>
            )
        }
        return (
            <div style={{marginBottom: '100px'}}>
                <div className="container">
                    {this.renderDataUser()}
                    <div className='row' style={{marginTop: '50px'}}>
                        {
                            this.state.countPosts === 0
                            ?
                            <h3>No posts yet</h3>
                            :
                            <>
                            {this.renderUserPhoto()}
                            </>
                        }
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