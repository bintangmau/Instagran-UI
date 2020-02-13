import React, { useEffect, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert'
import io from 'socket.io-client'

import { urlApi } from '../helper/database';
import '../pages/home/MainPage.css'

export default function ListPhoto({ dataListPhoto, idUser }) {
    const [ liked, setLiked ] = useState(false)
    const [ date, setDate ] = useState(moment().startOf('hour').fromNow())
    const [ countLike, setCountLike ] = useState(0)
    const [ comment, setComment ] = useState('')
    const [ listComment, setListComment ] = useState([])


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
            axios.post(urlApi + 'notification/notiflikephoto', {
                id_fail: idUser,
                id_maful: dataListPhoto.id,
                date_notif: new Date().getFullYear() + '-' + (new Date().getMonth() + 1)  + '-' + new Date().getDate(),
                message: 'Menyukai foto anda',
                id_photo: dataListPhoto.idphotos
            })
            .then(() => {
                setLiked(true)
                getCountLike()
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
            swal('Ups!', 'Like gagal', 'error')
        })      
    }

    const unLikePhoto = () => {
        axios.post(urlApi + 'photo/unlikephoto', { idUser, idPhoto: dataListPhoto.idphotos })
        .then(() => {
            setLiked(false)
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
    
    const getListComment = () => {
        axios.get(urlApi + 'photo/getlistcomment/' + dataListPhoto.idphotos)
        .then((res) => {
            setListComment(res.data)
        })
        .catch((err) => {
            console.log(err)
            swal('Ups', 'get list failed', 'error')
        })
    }

    const onBtnSendComment = (event) => {
        if (event.key === 'Enter') {
            if(!comment) {
                return null
            } else {
                axios.post(urlApi + 'photo/commentphoto', {
                    comment,
                    id_user_comment: idUser,
                    id_photo_comment: dataListPhoto.idphotos,
                    date_comment: date
                })
                .then(() => {
                    setComment('')
                    getListComment()
                })
                .catch((err) => {
                    console.log(err)
                    swal('Ups!', 'Comment Failed', 'error')
                })
            }
        }
    }
    
    const renderListComment = () => {
        return listComment.map((val) => {
            return (
                <div>
                    <p style={{fontSize: '18px'}}><span>{val.username}</span> {val.comment}</p>
                </div>
            )
        })
    }

    useEffect(() => {
        checkLikePhoto()
        getCountLike()
        getListComment()
        renderListComment()
    }, [])


    return (
            <div className='listFoto1 shadow'>
                <div className="listHeader1">
                    <img style={{width: "80px", height: '80px',objectFit: 'cover', borderRadius: "50%"}} src={urlApi + dataListPhoto.photo} alt=""/>
                    <p>
                        <Link to={`/otherprofilepage/${dataListPhoto.id}`} style={{textDecoration: 'none', color: 'black'}}>{dataListPhoto.username}</Link>
                    </p>
                </div>
                <img src={urlApi + dataListPhoto.path_photo} alt=""/>
                <div className='listLike1'>
                    <div className="caption1">
                        <Link to={`/likers/${dataListPhoto.idphotos}`}>
                            <span style={{color: 'black'}}>{countLike} Likes</span>
                        </Link>
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <p>
                            <span><Link to={`/otherprofilepage/${dataListPhoto.id}`} style={{textDecoration: 'none', color: 'black'}}>{dataListPhoto.username}</Link></span> {dataListPhoto.caption}</p><br />
                        <div className="caption2">
                            {
                                liked
                                ?
                                <button onClick={unLikePhoto}>Unlike</button>
                                :
                                <button onClick={likePhoto}>Like</button>
                            }
                        </div>
                        {/* <ListComment idPhoto={dataListPhoto.idphotos} /> */}
                        <div className="comment1">
                            {renderListComment()}
                            <div className="comment2">
                                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} onKeyUp={onBtnSendComment}/>
                                    <label>Comment</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
