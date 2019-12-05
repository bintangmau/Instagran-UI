import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfilePage extends Component {
    render() {
        return (
            <div>
                <h4>Profile</h4>
                <h4>{this.props.username}</h4>
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