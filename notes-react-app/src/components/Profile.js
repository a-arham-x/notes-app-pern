import React, { useEffect, useState } from 'react'
import userContext from './context/userContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/utils.css"
import Navbar from './Navbar';

function Profile() {

    const navigate = useNavigate();
    const context = useContext(userContext);
    const { getUser } = context;
    const [user, setUser] = useState()

    const fetchUser = async () => {
        const response = await getUser();
        console.log(response)
        if (response && response.user) {
            setUser({
                name: response.user.name || '',
                username: response.user.username || '',
                time_created: response.user.time_created || ''
            });
        } else {
            fetchUser();
        }
    }

    useEffect(() => {
        if (localStorage.getItem("user-token")) {
            fetchUser();
        } else {
            navigate("/");
        }
    }, [navigate, getUser])

    const goToProfileUpdate = ()=>{
        navigate("/updateProfile")
    }

    return (
        <>
            <Navbar/>
            <div className="page-head">
                <h1>Your Information</h1>
                <img src={require("../images/edit.png")} width="20" alt="editing pic" onClick={goToProfileUpdate}/>
            </div>
            <div className="profile">
                <div className="profile-row">
                    <h2>Name: </h2>
                    <h3>{user && user.name}</h3>
                </div>
                <div className="profile-row">
                    <h2>Username: </h2>
                    <h3>{user && user.username}</h3>
                </div>
                <div className="profile-row">
                    <h2>Date Created: </h2>
                    <h3>{user && user.time_created.slice(0, 10)}</h3>
                </div>
            </div>
        </>
    )
}

export default Profile