import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './Navbar.css'
import { logOut } from '../redux/actions/userAction'
import swal from 'sweetalert';


class Navbar extends Component{

    btnLogOut = () => {
        if(window.confirm('Are you Sure to Log Out ?')) {
            this.props.logOut()
            swal('GoodBye', 'You have left', 'success')
        }
    }

    render() {
        return (
            <div>
                <div className='navbar1'>
                    <h1>
                        <Link to='/' className='judulNavbar'>Instagran</Link>
                    </h1>
                    <h4 style={{marginLeft: "800px"}}>
                        <Link to='/explore' className='navbarItem1'>Explore</Link>
                    </h4>
                    {
                        this.props.username === ''
                        ?
                        null
                        :
                        <h4 style={{marginLeft: '30px'}}>
                            <Link to='/profile' className='navbarItem1'>Profile</Link>
                        </h4>
                    }
                    {/* {
                        this.props.username === ''
                        ?
                        <h4 style={{marginLeft: "30px"}}>
                            <Link to='/auth' className='navbarItem1'>Login</Link>
                        </h4>
                        :
                        null
                    } */}
                    {
                        this.props.username === ''
                        ?
                        null
                        :
                        <h4 style={{marginLeft: "30px"}}>
                            <Link className='navbarItem1'>
                                <input type="button" value="Log out" className='tombolKeluar' onClick={this.btnLogOut}/>
                            </Link>
                        </h4>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username
    }
}

export default connect(mapStateToProps, { logOut } )(Navbar);   