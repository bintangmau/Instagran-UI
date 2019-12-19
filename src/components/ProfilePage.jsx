import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import { urlApi } from '../helper/database'
import { Redirect, Link } from 'react-router-dom'
import moment from 'moment'
import swal from 'sweetalert';
import './ProfilePage.css'

class ProfilePage extends Component {
    state = {
        dataUser: [],
        showPost: false,
        caption: '',
        datePhoto: moment().startOf('hour').fromNow(),
        photo: '',
        tampungUserPhoto: [],
        loadingPost: false,
        countPosts: 0,
        countFollowers: 0,
        countFollowings: 0
    }

    componentDidMount() {
        this.getDataUser()
        this.getCountPosts()
        this.getCountFollowers()
        this.getCountFollowings()
        this.renderProfile()
        this.getPhotoUser()
        this.renderUserPhoto()
    }

    getDataUser = () => {
        axios.post(urlApi + 'user/getdatauser', { idUser: this.props.match.params.id })
        .then((res) => {
            this.setState({ dataUser: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal', 'error')
        })
    }

    getCountPosts = () => {
        axios.post(urlApi + 'user/countposts', { idUser: this.props.id })
        .then((res) => {
            this.setState({ countPosts: res.data[0].jumlahPost })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal count posts', 'error')
        })
    }

    getCountFollowers = () => {
        axios.post(urlApi + 'user/countfollowers', { idUser: this.props.id })
        .then((res) => {
            this.setState({ countFollowers: res.data[0].jumlahFollowers })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal count followers', 'error')
        })
    }

    getCountFollowings = () => {
        axios.post(urlApi + 'user/countfollowings', { idUser: this.props.id})
        .then((res) => {
            this.setState({ countFollowings: res.data[0].jumlahFollowing })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get gagal count following', 'error')
        })
    }

    getPhotoUser = () => {
        axios.get(urlApi + 'photo/getuserphoto/' + this.props.id)
        .then((res) => {
            this.setState({ tampungUserPhoto: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('ups', 'get foto gagal', 'error')
        })
    }

    imagePost = (e) => {
        // console.log(e.target.files)
        if(e.target.files[0]) {
            this.setState({ photo: e.target.files })
        } else {
            this.setState({ photo: null })
        }
    }

    onBtnPostPhoto = () => {
        let bodyFormData = new FormData()

        var options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const data = {
            id_user : this.props.id,
            caption : this.state.caption,
            date_photo: this.state.datePhoto
        }

        bodyFormData.append('data', JSON.stringify(data))
        bodyFormData.append('image', this.state.photo[0])

        if(this.state.photo === '') {
            swal('Ups!', 'Choose Photo!', 'warning')
        } else if(this.state.caption === '') {
            swal('Ups!', 'Input Caption!', 'warning')
        } else {
            this.setState({ loadingPost: true })
            axios.post(urlApi + 'photo/postphoto', bodyFormData, options)
            .then(() => {
                this.setState({ caption: '', photo: "",loadingPost: false, showPost: false})
                this.getCountPosts()
                this.getPhotoUser()
                swal('Yeh', 'Upload Success', 'success')
            })
            .catch((err) => {
                this.setState({ loadingPost: false })
                console.log(err)
                swal('Ups', 'Upload Failed', 'error')
            })
        }
    }

    renderProfile = () => {
        return this.state.dataUser.map((val) => {
            return (
                <div className='profile1'>
                    <div className="row">
                        <div className="col-md-3">
                            <img src={urlApi + val.photo} alt="" />
                        </div>
                        <div className="col-md-9">
                            <div className='profile2'>
                                <div className="profile3">
                                    <h4>{val.username}</h4>
                                    <p style={{marginLeft: '30px'}}><span>{this.state.countPosts}</span> <br/>posts</p>
                                    <p style={{marginLeft: '30px'}}><span>{this.state.countFollowers}</span> <br/>followers</p>
                                    <p style={{marginLeft: '30px'}}><span>{this.state.countFollowings}</span> <br/>following</p>
                                </div>
                                <p>{val.name}</p>
                                {
                                    this.state.showPost
                                    ?
                                    null
                                    :
                                    <div>
                                        <button className='btn btn-success' onClick={() => this.setState({ showPost: true })}>Post</button>
                                    </div>
                                }
                                {
                                    this.state.showPost
                                    ?
                                    <div>
                                        <div style={{marginTop: '20px'}} className='postBody'>
                                            <input type="file" onChange={this.imagePost} id="file" accept="image/*"/>
                                            <div className='labelDiv'>
                                            <label htmlFor="file">
                                            + Choose a Photo
                                            </label>
                                            </div>
                                            <br />
                                            <input type="text" placeholder='Caption' onChange={(e) => this.setState({ caption: e.target.value})} value={this.state.caption}/>
                                        </div>
                                        <div className="footerPost">
                                            {
                                                this.state.loadingPost
                                                ?
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                :
                                                <>
                                                    <input type="button" value="Post" className="btn btn-success" onClick={this.onBtnPostPhoto}/>
                                                    <input type="button" value="Cancel" className='btn btn-danger' onClick={() => this.setState({ showPost: false })}/>
                                                </>
                                            }
                                        </div>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    renderUserPhoto = () => {
        return this.state.tampungUserPhoto.map((val) => {
            return (
                <div className='col-md-3'>
                    <Link to={`/detailsphoto/${val.idphotos}`}>
                        <img src={urlApi + val.path_photo} alt=""/>
                    </Link>
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
                <div className="container">
                    {this.renderProfile()}
                    <div className='tampilUserPhoto row'>
                        {this.renderUserPhoto()}
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

export default connect(mapStateToProps)(ProfilePage);