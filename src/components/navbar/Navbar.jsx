import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
// import './Navbar.css'
import { logOut } from '../../redux/actions/userAction'
import swal from 'sweetalert';
import { urlApi } from '../../helper/database';

class Navbar extends Component{
    state = {
        jumlahPesan: 0
    }
    btnLogOut = () => {
        if(window.confirm('Are you Sure to Log Out ?')) {
            this.props.logOut()
            swal('GoodBye', 'You have left', 'success')
        }
    }   

    getJumlahPesan = () => {
        axios.get(urlApi + 'chats/getjumlahpesannotif/' + this.props.id)
        .then((res) => {
            console.log(res.data)
            this.setState({ jumlahPesan: res.data[0].jumlahPesan })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.getJumlahPesan()
    }

    render() {
        return (
            <div>
                <nav className="mb-1 navbar navbar-expand-lg navbar-dark indigo lighten-1">
                    <Link to='/'>
                        <a className="navbar-brand" href="#">Instagran</a>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-555" aria-controls="navbarSupportedContent-555" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent-555">
                        <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to='/explore'>
                                <a className="nav-link" href="#">Explore</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/notification'>
                                <a className="nav-link" href="#">Notification</a>
                            </Link>
                        </li>
                        {
                            this.props.username === ''
                            ?
                            null
                            :
                            <>
                            <button onClick={this.props.logOut} style={{backgroundColor: 'red'}}>
                                Log Out
                            </button>
                            {/* <li className="nav-item">
                                <Link to='/notification' onClick={this.props.logOut}>
                                    <a className="nav-link" href="#">Log Out</a>
                                </Link>
                            </li> */}
                            </>
                        }
                        {/* <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-555" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown
                            </a>
                            <div className="dropdown-menu dropdown-secondary" aria-labelledby="navbarDropdownMenuLink-555">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li> */}
                        </ul>

                        {
                            this.props.username == ''
                            ?
                            null
                            :
                            <>

                            <ul className="navbar-nav ml-auto nav-flex-icons">
                                <li className="nav-item" style={{marginTop: '40px', marginRight: '15px', fontSize: '20px'}}>
                                    <Link to='/directmessage'>
                                        <a className="nav-link waves-effect waves-light">
                                        <i className="fas fa-envelope" style={{ color: 'black', fontWeight: 'bold', fontSize: '25px'}}/>
                                        </a>
                                    </Link>
                                </li>

                                <li className="nav-item avatar dropdown">
                                    <a className="nav-link" id="navbarDropdownMenuLink-55" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <Link to={`/profile/${this.props.id}`}>
                                            <img src={urlApi + this.props.photo} className="rounded-circle z-depth-0" style={{width: '70px', height: '70px', objectFit: 'cover'}} alt="avatar image" />
                                        </Link>
                                    </a>
                                </li>
                            </ul>

                            </>
                        }


                    </div>
                </nav>
                {/* <div className='navbar1'>
                    <h1>
                        <Link to='/' className='judulNavbar'>Instagran</Link>
                    </h1>
                    {
                        this.props.username === ''
                        ?
                        null
                        :
                        <>
                        <h4 style={{marginLeft: "800px"}}>
                            <Link to='/explore' className='navbarItem1'>Explore</Link>
                        </h4>
                        <h4 style={{marginLeft: '30px'}}>
                            <Link to='/notification' className='navbarItem1'>Notification</Link>
                        </h4>
                        <h4 style={{marginLeft: '30px'}}>
                            <Link to={`/profile/${this.props.id}`} className='navbarItem1'>Profile</Link>
                        </h4>
                        </>
                    }
                    {
                        this.props.username === ''
                        ?
                        null
                        :
                        <input type="button" value="Log out" className='btn btn-danger' onClick={this.btnLogOut}/> 
                    }
                </div> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        id: state.user.id,
        photo: state.user.photo
    }
}

export default connect(mapStateToProps, { logOut } )(Navbar);   