import axios from 'axios'
import { urlApi } from '../../helper/database'
import swal from 'sweetalert'

export const registerUser = (registerUser, options) => {
    return () => {
        axios.post(urlApi + 'user/register', registerUser, options)
        .then(() => {
            swal('Yeah', 'Register Success', 'success')
        })
        .catch((err) => {
            console.log(registerUser)
            swal('Ups', 'Something is Wrong!', 'error')
        })
    }
}

export const loginUser = (loginUser) => {
    return (dispatch) => {
        axios.get(urlApi + `user/login/${loginUser}`)
        .then((res) => {
           if(res.data.length > 0) {
               dispatch({
                   type: 'LOGIN',
                   payload: {
                       id: res.data[0].id,
                       username: res.data[0].username,
                       password: res.data[0].password,
                       role: res.data[0].role,
                       photo: res.data[0].photo,
                       name: res.data[0].name
                   }
               })
               localStorage.setItem('data', res.data[0].username)
               swal('Login Success', `Welcome, ${res.data[0].username}`, 'success')
           } else {
               swal('Ups', 'Username/Password id Wrong', 'error')
           }
        })
        .catch((err) => {
            console.log(loginUser)
            swal('Ups', 'Register Failed', 'error')
        })
    }
}

export const logOut = () => {
    return (dispatch) => {
        localStorage.removeItem('data')
        dispatch({
            type: 'LOG_OUT'
        })
    }
}


export const keepLogin = (username) => {
    return (dispatch) => {
        axios.get(urlApi + 'user/keeplogin/' + username)
        .then((res) => {
            dispatch({
                type: 'KEEP_LOGIN',
                payload: {
                       id: res.data[0].id,
                       username: res.data[0].username,
                       password: res.data[0].password,
                       role: res.data[0].role,
                       photo: res.data[0].photo,
                       name: res.data[0].name
                   }
            })
        })
        .catch((err) => {
            
        })
    }
}
