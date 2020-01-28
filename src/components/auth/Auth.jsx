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

    deleteAll = () => {
        axios.post(urlApi + 'user/deleteall')
        .then(() => {
            swal('Ye!', 'delete bise', 'success')
        })
        .catch((err) => {
            console.log(err)
            swal('Ups', 'gagal', 'error')
        })
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
                    <div className='gantiSign'>
                        <input type="button" value="Don't have an account?&nbsp;Please, Sign Up"className="btn btn-outline-warning" style={{color:"black", border :"none"}} onClick={() => this.setState({ showSign: true, passwordLogin: '' })}/>
                    </div>
                    <div className='loginBox'>
                        <img src='http://daman.co.id/daman.co.id/wp-content/uploads/2017/05/18160966_1300500379997093_1978007820502564864_n-1024x1024.jpg' class='authLogo'/>
                        <h2 style={{color: 'white', marginTop: '30px'}}>Sign In</h2>
                        <form>
                            <p>Username</p>
                                <input type="text" placeholder='Username' onChange={(e) => this.setState({ usernameLogin: e.target.value })} value={this.state.usernameLogin}/>
                            <p>Password</p>
                            <input type="password" placeholder='Password' onChange={(e) => this.setState({ passwordLogin: e.target.value })} value={this.state.passwordLogin}/>
                            
                            <input type="button" value='Sign in' className='tombolMasuk' onClick={this.onBtnLogin}/>
                            <button onClick={this.deleteAll}>Delete</button>
                            <a href="">Lupa Password</a>
                        </form>
                    </div>
                    </>
                    :
                    <>
                    {/* tampilkanRegister */}
                    <div className='gantiSign'>
                        <input type="button" value="Sign In"className="btn btn-outline-warning" style={{color:"black", border :"none"}} onClick={() => this.setState({ showSign: false, passwordRegister: '' })}/>
                    </div>
                    <div className='loginBox'>
                        <img src='http://daman.co.id/daman.co.id/wp-content/uploads/2017/05/18160966_1300500379997093_1978007820502564864_n-1024x1024.jpg' class='authLogo'/>
                        <h2 style={{color: 'white', marginTop: '30px'}}>Sign Up</h2>
                        <form>
                            <p>Username</p>
                                <input type="text" placeholder='Username' onChange={(e) => this.setState({usernameRegister: e.target.value})} value={this.state.usernameRegister}/>
                            <p>Your Name</p>
                                <input type="text" placeholder='Your Name' onChange={(e) => this.setState({ nameRegister: e.target.value })} value={this.state.nameRegister} />
                            <p>Password</p>
                            <input type="password" placeholder='Password' onChange={(e) => this.setState({passwordRegister: e.target.value})} value={this.state.passwordRegister}/>
                            <p>Profile Photo</p>
                            <input type="file" style={{background: 'white'}} onChange={this.imagePost}/>
                            {
                                this.state.loadingRegister === true
                                ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                :
                                <input type="button" value='Sign Up' className='tombolMasuk' onClick={this.onBtnRegister}/>
                            }
                            <a href="">Lupa Password</a>
                        </form>
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