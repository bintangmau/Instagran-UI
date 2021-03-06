import React, { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux'
import { urlApi } from '../../helper/database'
import { Redirect } from 'react-router-dom'
import io from 'socket.io-client'
import SimpleImageSlider from "react-simple-image-slider";

import './DetailsPhoto.css'

class DetailsPhoto extends Component {
    state = {
        tampungDetailsPhoto: [],
        editCaptionShow: false,
        newCaption: '',
        pindahHabisHapus: false,
        tampungSlidePhoto: [],
        listComment: []
    }

    getDetailsPhoto = () => {
        axios.get(urlApi + 'photo/getphotodetails/' +  this.props.match.params.id)
        .then((res) => {
            this.setState({ tampungDetailsPhoto: res.data })
            // console.log(this.state.tampungDetailsPhoto[0])
            // swal('Ye!', 'get bisa', 'success')
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'get gagal', 'error')
        })
    }

    getListComment = () => {
        axios.get(urlApi + 'photo//getlistcommentinprofile/' + this.props.match.params.id)
        .then((res) => {
            this.setState({ listComment: res.data })
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
            swal('Ups', 'Get comment failed', 'error')
        })
    }

    // getSliderPhoto = () => {
    //     axios.get(urlApi + 'photo/getsliderphoto/' + this.props.id)
    //     .then((res) => {
    //         this.setState({ tampungSlidePhoto: res.data })
    //         console.log(res.data)
    //         swal('ye!', 'get bisa', 'success')
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //         swal('Ups!', 'gagal', 'error')
    //     })
    // }

    editCaption = () => {
        if(this.state.newCaption === '') {
            swal('Ups', 'Input New Caption!', 'warning')
        } else {
            axios.post(urlApi + 'photo/editcaption', { newCaption: this.state.newCaption, idPhoto: this.props.match.params.id})
            .then(() => {
                this.setState({ editCaptionShow: false })
                this.getDetailsPhoto()
            })
            .catch((err) => {
                console.log(err)
                swal('Ups!', 'Edit Failed', 'error')
            })
        }
    }

    deletePhoto = () => {
        if(window.confirm('Are you Sure to Delete this Photo ?')) {
            axios.delete(urlApi + 'photo/deletephoto/' + this.props.match.params.id)
            .then(() => {
                this.setState({ pindahHabisHapus: true })
                swal('Ye!', 'Delete Success', 'success')
            })
            .catch((err) => {
                console.log(err)
                swal('Ups!', 'Delete Failed', 'error')
            })
        }
    }

    renderListComment = () => {
        return this.state.listComment.map((val, idx) => {
            return (
                <div>
                    <h2>{val.comment}</h2>
                </div>
            )
        })
    }

    renderDetails = () => {
        return this.state.tampungDetailsPhoto.map((val) => {
            return (
                <div>
                    <div>
                    {/* <SimpleImageSlider
                        width={896}
                        height={504}
                        images={urlApi + val.path_photo}
                    /> */}
                    </div>
                    <div className='detailsOption'>
                        <input type="button" value="Edit Caption" onClick={() => this.setState({ editCaptionShow: true })}/>
                        <input type="button" value="Delete this photo" onClick={this.deletePhoto}/>    
                    </div>
                    <div className="details1">
                        <div className="detailsPhoto">
                            <img src={urlApi + val.path_photo} alt=""/>
                        </div>
                        <div className="details2">
                            <h4>{val.username}</h4>
                            {
                                !this.state.editCaptionShow
                                ?
                                <>
                                    <p>{val.caption}</p>

                                    <p><span style={{color: 'blue'}}>#{val.hashtag}</span></p>
                                </>
                                :
                                <>
                                <div className='editCaption'>
                                    <input type="text" placeholder={val.caption} onChange={(e) => this.setState({ newCaption: e.target.value })}/>
                                    <input type="button" className='btn btn-success' value="Edit" onClick={this.editCaption}/>
                                    <input type="button" className='btn btn-danger' value="Cancel" onClick={() => this.setState({ editCaptionShow: false })}/>
                                </div>
                                </>
                            }
                            {this.renderListComment()}
                        </div>
                    </div>
                </div>
            )
        })
    }

    componentDidMount() {
        this.getDetailsPhoto()
        this.renderDetails()
        this.getListComment()
        this.socket = io(`${urlApi}`)
        this.socket.on('upload-photo',data=>{ // menunggu dr server
            this.getListComment()
        })
    }


    render() {
        if(this.state.pindahHabisHapus) {
            return <Redirect to={`/profile/${this.props.id}`} />
        }
        return (
            <div>
                {this.renderDetails()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.user.id
    }
}

export default connect(mapStateToProps)(DetailsPhoto);