import React, { useEffect, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert'
import { urlApi } from '../helper/database';
import './MainPage.css'

export default function ListPhoto({ dataListPhoto,  sendCommentBtn, idUser }) {
    const [ liked, setLiked ] = useState(false)
    const [ date, setDate ] = useState(moment().startOf('hour').fromNow())
    const [ countLike, setCountLike ] = useState(0)

    const checkLikePhoto = () => {
        axios.post(urlApi + 'photo/checklikephoto', { idUser, idPhoto: dataListPhoto.idphotos })
        .then((res) => {
            if(res.data.length === 0) {
                setLiked(false)
            } else {
                setLiked(true)
            }
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'getlike gagal', 'error')
        })
    }

    
    const likePhoto = () => {
        axios.post(urlApi + 'photo/likephoto', { id_user: idUser, id_photo: dataListPhoto.idphotos, date_likes: date})
        .then(() => {
            getCountLike()
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'Like gagal', 'error')
        })      
    }
    
    const getCountLike = () => {
        axios.get(urlApi + 'photo/countlike/' + dataListPhoto.idphotos)
        .then((res) => {
            setCountLike(res.data[0].jumlahLikes)
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'get gagal', 'error')
        })
    }
    
    useEffect(() => {
        checkLikePhoto()
        getCountLike()
    })

    return (
            <div className='listFoto1 shadow'>
                <div className="listHeader1">
                    <img style={{width: "80px", borderRadius: "50%"}} src={urlApi + dataListPhoto.photo} alt=""/>
                    <p>
                        <Link to={`/otherprofilepage/${dataListPhoto.id}`} style={{textDecoration: 'none', color: 'black'}}>{dataListPhoto.username}</Link>
                    </p>
                </div>
                <img src={urlApi + dataListPhoto.path_photo} alt=""/>
                <div className='listLike1'>
                    <div className="caption1">
                        <span>{countLike} Likes</span>
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <p>
                            <span><Link to={`/otherprofilepage/${dataListPhoto.id}`} style={{textDecoration: 'none', color: 'black'}}>{dataListPhoto.username}</Link></span> {dataListPhoto.caption}</p><br />
                        <div className="caption2">
                            {
                                liked
                                ?
                                <button>Unlike</button>
                                :
                                <button onClick={likePhoto}>Like</button>
                            }
                        </div>
                        <div className="comment1">
                            <h2>Comment here</h2>
                            <div className="comment2">
                                <form>
                                    <input type="text" onChange={(e) => this.setState({ comment: e.target.dataListPhoto })}/>
                                    <label>Comment</label>
                                    <span></span>
                                </form>
                            </div>
                            <button onClick={() => sendCommentBtn(dataListPhoto.idphotos)}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}
