import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { registerUser, loginUser } from '../../redux/actions/userAction'
import swal from 'sweetalert'

import './Auth.css'
import { urlApi } from '../../helper/database'

class Auth extends Component {
    state = {
        showSign: false,
        usernameRegister: '',
        passwordRegister: '',
        nameRegister: '',
        usernameLogin: '',
        passwordLogin: '',
        tampungGambar: '',
        tampungDataCek: '',
        loadingRegister: false
    }

    onBtnRegister = ()  => {
        let bodyFormData = new FormData()

        var options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        var data = {
            username: this.state.usernameRegister,
            password: this.state.passwordRegister,
            role: 'user',
            name: this.state.nameRegister
        }

        bodyFormData.append('data', JSON.stringify(data))
        bodyFormData.append('image', this.state.tampungGambar[0])
        
        if(this.state.usernameRegister === '') {
            swal('Ups!', 'Input Username!', 'warning')
        } else if(this.state.passwordRegister === '') {
            swal('Ups!', 'Input Password', 'warning')
        } else {
            this.setState({ loadingRegister: true })
            axios.get(urlApi + 'user/getcekregister/' + this.state.usernameRegister)
            .then((res) => {
                if(res.data.length > 0) {
                    this.setState({ loadingRegister: false })
                    swal('Ups', 'Username Used!', 'warning')
                } else {
                    this.props.registerUser(bodyFormData, options)
                    this.setState({ usernameRegister: '', passwordRegister: '', tampungGambar: '', nameRegister: '', loadingRegister: false})
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ loadingRegister: false})
                swal('ups', 'get gagal', 'error')
            })
        }
    }

    onBtnLogin = () => {
        if(this.state.usernameLogin === '') {
            swal('Ups!', 'Input Username!', 'warning')
        } else if(this.state.passwordLogin === '') {
            swal('Ups!', 'Input Password', 'warning')
        } else {
            this.props.loginUser(this.state.usernameLogin)
        }
    }

    imagePost = (e) => {
        // console.log(e.target.files)
        if(e.target.files[0]) {
            this.setState({ tampungGambar: e.target.files })
        } else {
            this.setState({ tampungGambar: null })
        }
    }

    render() {
        if(this.props.username) {
            return <Redirect to='/'/>
        }
        return (
            <div>
                {
                    !this.state.showSign
                    ?
                    <>
                    <div className='loginBox shadow'>
                       
                        <h2 style={{color: 'white', marginTop: '30px'}}>Sign In</h2>
                        <form>
                            <p>Username</p>
                                <input type="text" onChange={(e) => this.setState({ usernameLogin: e.target.value })} value={this.state.usernameLogin}/>
                            <p>Password</p>
                            <input type="password" onChange={(e) => this.setState({ passwordLogin: e.target.value })} value={this.state.passwordLogin}/>
                           
                            <input type="button" value='Sign in' className='tombolMasuk' onClick={this.onBtnLogin}/>
                        </form>

                        <div className='gantiSign'>
                            <button className="btn btn-dark" onClick={() => this.setState({ showSign: true, passwordLogin: '' })}>
                            Daftar
                            </button>
                        </div>

                    </div>
                    </>
                    :
                    <>
                    {/* tampilkanRegister */}
                    <div className='loginBox shadow'>
                
                        <h2 style={{color: 'white', marginTop: '30px'}}>Sign Up</h2>
                    
                            <p>Username</p>
                                <input type="text" onChange={(e) => this.setState({usernameRegister: e.target.value})} value={this.state.usernameRegister}/>
                            <p>Your Name</p>
                                <input type="text" onChange={(e) => this.setState({ nameRegister: e.target.value })} value={this.state.nameRegister} />
                            <p>Password</p>
                            <input type="password" onChange={(e) => this.setState({passwordRegister: e.target.value})} value={this.state.passwordRegister}/>
                            <p>Profile Photo</p>
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" onChange={this.imagePost} id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                                <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                            </div>
                            {
                                this.state.loadingRegister === true
                                ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                :
                                <input type="button" value='Sign Up' className='tombolMasuk' onClick={this.onBtnRegister}/>
                            }

                            <div className='gantiSign'>
                                <button className="btn btn-dark" onClick={() => this.setState({ showSign: false, passwordRegister: '' })}>
                                    Masuk
                                </button>
                            </div>
                        
                    </div>
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username
    }
}

export default connect(mapStateToProps, {registerUser, loginUser})(Auth);