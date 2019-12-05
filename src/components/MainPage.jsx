import React, { Component } from 'react';
import { connect } from 'react-redux' 
import { Redirect } from 'react-router-dom'
import './MainPage.css'


class MainPage extends Component {
    render() {
        if(this.props.username === '') {
            return <Redirect to='/auth'/>
        }
        return (
            <div>
                <div className='listFoto1'>
                    <div className="listHeader1">
                        <img style={{width: "80px", borderRadius: "50%"}} src="http://daman.co.id/daman.co.id/wp-content/uploads/2017/05/18160966_1300500379997093_1978007820502564864_n-1024x1024.jpg" alt=""/>
                        <p>Jon</p>
                    </div>
                    <img src="https://media.travelingyuk.com/wp-content/uploads/2019/05/Liburan-Indie-di-Ranu-Kumbolo-Lumajang-Jawa-Timur-1.jpg" alt=""/>
                    <div className='listLike1'>
                        <div className="caption1">
                            <p> <span>Jon</span> dan tak ada air mata yang tersisa semua sirna</p>

                        </div>
                    </div>
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

export default connect(mapStateToProps)(MainPage); 