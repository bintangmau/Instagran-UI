import React, { Component } from 'react'
import axios from 'axios'
import { urlApi } from '../../helper/database'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class Followers extends Component {
    state = {
        dataFollowers: []
    }

    getDataFollowers = () => {
        axios.get(urlApi + 'user/getdatafollowers/' + this.props.match.params.id)
        .then((res) => {
            this.setState({ dataFollowers: res.data })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderFollowers = () => {
        return this.state.dataFollowers.map((val, idx) => {
            return (
                <div>
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
                </div>
            )
        })
    }

    componentDidMount() {
        this.getDataFollowers()
    }

    render() {
        if(this.props.username == '') {
            return <Redirect to='/auth'/>
        }
        return (
            <div className='container'>
                {
                    this.state.dataFollowers.length < 1
                    ?
                    <center>
                        <div style={{marginTop: '100px'}} className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>                       
                        </div>
                    </center>
                    :
                    <>
                    <center>
                        {this.renderFollowers()}
                    </center>
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
    }
}

export default connect(mapStateToProps, {})(Followers);