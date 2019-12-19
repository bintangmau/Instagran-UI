import React, { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux'
import { urlApi } from '../helper/database'
import { Redirect } from 'react-router-dom'

import './DetailsPhoto.css'

class DetailsPhoto extends Component {
    state = {
        tampungDetailsPhoto: [],
        editCaptionShow: false,
        newCaption: '',
        pindahHabisHapus: false
    }

    componentDidMount() {
        this.getDetailsPhoto()
        this.renderDetails()
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

    editCaption = () => {
        if(this.state.newCaption === '') {
            swal('Ups', 'Input New Caption!', 'warning')
        } else {
            axios.post(urlApi + 'photo/editcaption', { newCaption: this.state.newCaption, idPhoto: this.props.match.params.id})
            .then(() => {
                this.setState({ editCaptionShow: false })
                this.getDetailsPhoto()
                swal('Ye!', 'Edit Success', 'success')
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

    renderDetails = () => {
        return this.state.tampungDetailsPhoto.map((val) => {
            return (
                <div>
                    <div className='detailsOption'>
                        <input type="button" value="Edit Caption" onClick={() => this.setState({ editCaptionShow: true })}/>
                        <input type="button" value="Delete" onClick={this.deletePhoto}/>    
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
                                    <p>{val.caption}</p>
                                :
                                <>
                                <div className='editCaption'>
                                    <input type="text" placeholder={val.caption} onChange={(e) => this.setState({ newCaption: e.target.value })}/>
                                    <input type="button" value="Edit" onClick={this.editCaption}/>
                                    <input type="button" value="Cancel" onClick={() => this.setState({ editCaptionShow: false })}/>
                                </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            )
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