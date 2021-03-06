import React, { Component } from 'react';
import axios from 'axios'
import { urlApi } from '../../helper/database'
import { connect } from 'react-redux' 
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom';

import '../detailsphoto/DetailsPhoto.css'

class OtherDetailsPhoto extends Component {
    state = {
        tampungDetailsPhoto: []
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

    renderDetails = () => {
        return this.state.tampungDetailsPhoto.map((val) => {
            return (
                <div>
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

    componentDidMount() {
        this.getDetailsPhoto()
    }

    render() {
        if(this.props.username == '') {
            return <Redirect to='/auth'/>
        }
        return (
            <div>
                {
                    this.state.tampungDetailsPhoto.length < 1
                    ?
                    <center>
                        <div style={{marginTop: '100px'}} className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>                       
                        </div>
                    </center>
                    :
                    <>
                        {this.renderDetails()}
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
    }
}

export default connect(mapStateToProps, {})(OtherDetailsPhoto);