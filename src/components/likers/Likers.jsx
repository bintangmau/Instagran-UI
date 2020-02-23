import React, { Component } from 'react'
import Axios from 'axios'
import { urlApi } from '../../helper/database'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Likers extends Component {
    state = {
        dataLikers: []
    }

    getDataLikers = () => {
        Axios.get(urlApi + 'photo/getdatalikers/' + this.props.match.params.id)
        .then((res) => {
            this.setState({ dataLikers: res.data })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderDataLikers = () => {
        return this.state.dataLikers.map((val, idx) => {
            return (
                <div className="row" style={{padding: '20px', width: '50%'}}>
                    <div className="col-md-3">
                        <Link to={`/otherprofilepage/${val.id}`}>
                            <img src={urlApi + val.photo} style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}} alt=""/>
                        </Link>
                    </div>
                    <div className="col-md-9">
                        {
                            val.username == this.props.username
                            ?
                            <p style={{fontWeight: 'bold', float: 'left', margin: '20px', fontSize: '20px', color: 'black' }}>{val.username}</p>
                            :
                            <Link to={`/otherprofilepage/${val.id}`}>
                                <p style={{fontWeight: 'bold', float: 'left', margin: '20px', fontSize: '20px', color: 'black' }}>{val.username}</p>
                            </Link>
                        }
                    </div>
                </div>
            )
        })
    }

    componentDidMount() {
        this.getDataLikers()
    }

    render() {
        return (
            <div className='container'>
                <center>
                    {this.renderDataLikers()}
                </center>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
    }
}

export default connect(mapStateToProps, {})(Likers);