import React, { Component } from 'react';
import Axios from 'axios';
import { Link} from 'react-router-dom'
import { urlApi } from '../helper/database';
import { connect } from 'react-redux'
import moment from 'moment'
import swal from 'sweetalert';

import './ProfilePage.css'

class OtherProfilePage extends Component {
    state = {
        tampungDataUser: [],
        tampungUserPhoto: [],
        tampungCheckFollowed: [],
        waktu: moment().format("MMM Do YY")
    }

    componentDidMount() {
        this.checkFollowed()
        this.getDataUser()
        this.renderDataUser()
        this.getPhotoUser()
        this.renderUserPhoto()
    }
    
    componentDidUpdate() {
        this.getDataUser()
    }

    getDataUser = () => {
        Axios.post(urlApi + 'user/getdatauser', { idUser: this.props.match.params.id })
        .then((res) => {
            this.setState({ tampungDataUser: res.data })
        })
        .catch((err) => {
            alert(JSON.stringify(err))
            swal('Sip!', 'gagal', 'error')
        })
    }

    getPhotoUser = () => {
        Axios.get(urlApi + 'photo/getuserphoto/' + this.props.match.params.id)
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
            idFollowedUser: this.props.match.params.id
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
            id_followed_user: this.props.match.params.id,
            date_follows: this.state.waktu
        })
        .then(() => {
          this.checkFollowed()
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
                idFollowedUser: this.props.match.params.id
            })
            .then(() => {
                this.checkFollowed()
            })
            .catch((err) => {
                console.log(err)
                swal('Ups', 'unfollow error', 'error')
            })
        }
    }

    renderDataUser = () => {
        return this.state.tampungDataUser.map((val) => {
            return (
            <div className='profile1 row'>
                <div className="col-md-3">
                    <img src={urlApi + val.photo} alt="" />
                </div>
                <div className="col-md-9">
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
                            <p><span>100</span> Posts</p>
                            <p style={{marginLeft: '30px'}}><span>45 M</span> Followers</p>
                            <p style={{marginLeft: '30px'}}><span>300</span> Following</p>
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