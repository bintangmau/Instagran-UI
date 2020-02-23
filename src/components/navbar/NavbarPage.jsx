import React, { Component } from "react";
import {
MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
} from "mdbreact";
import { Link } from 'react-router-dom';
import { logOut } from '../../redux/actions/userAction'
import { connect } from 'react-redux'

class NavbarPage extends Component {
state = {
  isOpen: false
};

toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen });
}

btnLogOut = () => {
    if(window.confirm('Are you Sure to Log Out ?')) {
        this.props.logOut()
    }
}   

render() {
  return (
      <MDBNavbar color="indigo" dark expand="md">
        <MDBNavbarBrand>
            <strong className="white-text">
            <Link to='/'>
                        <a className="navbar-brand" href="#">Instagran</a>
                    </Link>  
            </strong>
        </MDBNavbarBrand>
        {
            this.props.username == ''
            ?
            null
            :
            <>
            <MDBNavbarToggler onClick={this.toggleCollapse} />
            <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav left>
                <MDBNavItem>
                <MDBNavLink to='/explore'>Explore</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                <MDBNavLink to="/notification">Notification</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                <MDBDropdown>
                    <MDBDropdownToggle nav caret>
                    <span className="mr-2">Other</span>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                        <MDBNavLink to='/directmessage'>
                            <MDBDropdownItem>
                                Message
                            </MDBDropdownItem>
                        </MDBNavLink>
                        <MDBNavLink to={`/profile/${this.props.id}`}>
                            <MDBDropdownItem>
                                {this.props.username}
                            </MDBDropdownItem>
                        </MDBNavLink>
                    {/* <MDBDropdownItem href="#!">Another Action</MDBDropdownItem>
                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem> */}
                    <button className='btn btn-danger btn-block' onClick={this.btnLogOut}>
                        Log Out
                    </button>
                    </MDBDropdownMenu>
                </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
            {/* <MDBNavbarNav right>
                <MDBNavItem>
                <MDBFormInline waves>
                    <div className="md-form my-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                    </div>
                </MDBFormInline>
                </MDBNavItem>
            </MDBNavbarNav> */}
            </MDBCollapse>
            </>
        }
      </MDBNavbar>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        id: state.user.id,
        photo: state.user.photo
    }
}

export default connect(mapStateToProps, { logOut } )(NavbarPage);   