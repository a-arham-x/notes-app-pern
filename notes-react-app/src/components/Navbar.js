import React, { useContext, useState, useEffect } from 'react'
import "../styles/utils.css"
import { useNavigate } from 'react-router-dom'
import userContext from './context/userContext';
import { Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const context = useContext(userContext)
    const { getUser } = context

    const [user, setUser] = useState();

    const fetchUser = async () => {
        setUser(await getUser())
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const logOut = (e) => {
        localStorage.setItem("user-token", "")
        navigate("/")
    }

    const moveToAddNote = (e)=>{
        e.preventDefault();
        navigate("/addnote")
    }

    const moveToProfile = (e)=>{
        e.preventDefault();
        navigate("/profile");
    }

    const moveToHome = (e)=>{
        e.preventDefault();
        navigate("/home")
    }
    return (
        <>
            <nav>
                    <p>Our Own Notes</p>
                    <p>{user && user.user.name}</p>
                
                <ul>
                    <li onClick={moveToHome}>Home</li>
                    <li onClick={moveToAddNote}>Add Note</li>
                    <li onClick={moveToProfile}>Profile</li>
                    <li onClick={logOut}>Log Out</li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar
