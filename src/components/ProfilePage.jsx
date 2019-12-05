import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import { urlApi } from '../helper/database'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert';
import './ProfilePage.css'

class ProfilePage extends Component {
    state = {
        dataUser: [],
        showPost: false
    }

    componentDidMount() {
        this.getDataUser()
        this.renderProfile()
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

    renderProfile = () => {
        return this.state.dataUser.map((val) => {
            return (
                <div className='profile1'>
                    <img src={urlApi + val.photo} alt="" />
                    <div className='profile2'>
                        <div className="profile3">
                            <h4>{val.username}</h4>
                            <button>Edit Profile</button>
                            <button onClick={() => this.setState({ showPost: true })}>Post</button>
                        </div>
                        <p>{val.name}</p>
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
              {this.renderProfile()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username
    }
}

export default connect(mapStateToProps)(ProfilePage);