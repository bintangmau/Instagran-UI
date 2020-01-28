import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { urlApi } from '../../helper/database'
import { Redirect, Link } from 'react-router-dom'
import { MDBFormInline } from "mdbreact";
import './ExplorePage.css'

class ExplorePage extends Component {
    state = {
        tampungListData : [],
        keyWords: '',
        showHasilCari: false,
        tampungHasilCari: []
    }

    getDataExplore = () => {
        const idUser = this.props.id 

        axios.get(urlApi + 'photo/getdatamainpage/' + idUser)
        .then((res) => {
            this.setState({ tampungListData: res.data })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'Get gabisa', 'error')
        })
    }

    renderListPhoto = () => {
        return this.state.tampungListData.map((val) => {
            return (
                <div className='col-md-3 listPhoto1'>
                    <Link to={`/otherprofilepage/${val.id}`}>
                        <img src={urlApi + val.path_photo} style={{width: '350px', height: '350px', margin: '30px', objectFit: 'cover'}}/>
                    </Link>
                </div>
            )
        })
    }

    searchPhoto = () => {
        axios.post(urlApi + 'photo/searchphoto', { username: this.state.keyWords, namaUser: this.props.username })
        .then((res) => {
            this.setState({ tampungHasilCari: res.data, showHasilCari: true })
            // console.log(res.data.length)
        })
        .catch((err) => {
            console.log(err)
            swal('Ups1')
        })    
    }

    renderHasilCari = () => {
        return this.state.tampungHasilCari.map((val) => { 
            return (
                <div className='row' style={{padding: '30px'}}>                   
                    <div className="col-md-2" style={{width: '10%'}}>
                        <img src={urlApi + val.photo} style={{width: '70px', borderRadius: '50%'}} alt=""/>
                    </div>
                    <div className="col-md-10" style={{width: '90%'}}>
                        <h4 style={{fontWeight: 'bold'}}><Link style={{color: 'black'}} to={`/otherprofilepage/${val.id}`}>{val.username}</Link></h4> 
                    </div>
                    <br />
                </div> 
            )
        })
    }

    componentDidMount () {
        this.getDataExplore()
        this.renderListPhoto()
        this.renderHasilCari()
    }


    render() {
        if(this.props.username === '') {
            return <Redirect to='/'/>
        }
        return (
            <div>
                <div className='container'>
                    <center>
                        <div className="row" style={{marginTop: '30px', width: '500px'}}>
                            <div className="col-md-8">
                                <MDBFormInline className="md-form">
                                    {/* <MDBIcon icon="search" /> */}
                                    <input className="form-control form-control-sm ml-3 w-75" value={this.state.keyWords} onChange={(e) => this.setState({ keyWords: e.target.value })} 
                                    type="text" placeholder="Search" aria-label="Search" onKeyUp={this.searchPhoto} />
                                </MDBFormInline>
                            </div>
                            <div className="col-md-4">
                                <div className="row" style={{width: '290px'}}>
                                    <div className="col-md-6">
                                        {
                                            this.state.showHasilCari
                                            ?
                                            <button className='btn btn-danger' onClick={() => this.setState({ showHasilCari: false, keyWords: '' })}>Cancel</button>
                                            :
                                            <button className='btn btn-dark' onClick={this.searchPhoto}>Search</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </center>
                {/* <MDBCol>
                    <MDBCard style={{ width: "22rem" }}>
                        <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" waves />
                        <MDBCardBody>
                            <center>
                                <MDBCardTitle>Card title</MDBCardTitle>
                                <MDBBtn href="#">MDBBtn</MDBBtn>
                            </center>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol> */}
                </div>
                <div style={{marginLeft: '200px', marginRight: '200px', marginTop: '100px'}}>
                        {
                            this.state.showHasilCari
                            ?
                            <>
                            <center>
                                <div className='shadow' style={{width: '700px'}}>
                                    {this.renderHasilCari()}
                                </div>
                            </center>
                            </>
                            :
                            <div className="row">
                                {this.renderListPhoto()}
                            </div>
                        }
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        id: state.user.id
    }
}

export default connect(mapStateToProps)(ExplorePage); 