const INITIAL_STATE = {
    id: 0,
    username: '',
    password: '',
    role: '',
    photo: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOGIN' :
            return {...INITIAL_STATE, id: action.payload.iduser, username: action.payload.username, password: action.payload.password, role: action.payload.role, photo: action.payload.photo}
        case 'LOG_OUT' :
            return {...INITIAL_STATE}
        case 'KEEP_LOGIN' :
            return {...INITIAL_STATE, id: action.payload.id, username: action.payload.username, password: action.payload.password, role: action.payload.role, photo: action.payload.photo}
            default :
        return state
    }
}