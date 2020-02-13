import React, { Component } from 'react'
import Axios from 'axios'
import { urlApi } from '../../helper/database'
import { Link } from 'react-router-dom'

class Followings extends Component {
    state = {
        dataFollowings: []
    }

    getDataFollowings = () => {
        Axios.get(urlApi + 'user/getdatafollowings/' + this.props.match.params.id)
        .then((res) => {
            this.setState({ dataFollowings: res.data })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderDataFollowings = () => {
        return this.state.dataFollowings.map((val, idx) => {
            return (
                <div>
                     <div className="row" style={{padding: '20px', width: '50%'}}>
                        <div className="col-md-3">
                            <Link to={`/otherprofilepage/${val.id}`}>
                                <img src={urlApi + val.photo} style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}} alt=""/>
                            </Link>
                        </div>
                        <div className="col-md-9">
                            <Link to={`/otherprofilepage/${val.id}`}>
                                <p style={{fontWeight: 'bold', float: 'left', margin: '20px', fontSize: '20px', color: 'black' }}>{val.username}</p>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        })
    }

    componentDidMount() {
        this.getDataFollowings()
    }

    render() {
        return (
            <div className='container'>
                <center>
                    {this.renderDataFollowings()}
                </center>
            </div>
        )
    }
}


export default Followings