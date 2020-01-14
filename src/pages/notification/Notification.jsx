import React, { useState } from 'react';
import Axios from 'axios';

export default function Notification() {
    const [ username, setUsername ] = useState('bintang')
    
    const getDataUser = () => {
        setUsername('andre')
    }

    return (
        <div>
            <h1>{username}</h1>
            <button onClick={getDataUser}>
                Click me cok    asmput
            </button>
        </div>
    )
}
