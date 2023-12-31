import React from 'react'
import "../styles/utils.css"
import Navbar from './Navbar'
import userContext from './context/userContext'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileUpdate() {

    const navigate = useNavigate();
    const context = useContext(userContext);
    const { getUser, updateName, updateUsername, updatePassword } = context;
    const [user, setUser] = useState()
    const [intype, setIntype] = useState("password");

    const fetchUser = async () => {
        const response = await getUser();
        console.log(response)
        if (response && response.user) {
            setUser({
                name: response.user.name || '',
                username: response.user.username || '',
                oldpassword: '',
                coldpassword: '',
                newpassword: ''
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

    const handleChange = (e)=>{
        setUser({...user, [e.target.name]: e.target.value})
        console.log(user.username)
    }

    const changeName = async (e)=>{
        e.preventDefault();
        await updateName(user.name);
    }

    const changeUsername = async (e)=>{
        e.preventDefault();
        await updateUsername(user.username);
    }

    const changePassword = async (e)=>{
        e.preventDefault();
        if (user.oldpassword!==user.coldpassword){
            console.log("Na Na Na")
        }else{
            const json = await updatePassword(user.oldpassword, user.coldpassword, user.newpassword);
            console.log(json)
        }
    }

    const changeIntype = ()=> {
        if (intype==="password"){
            setIntype("text");
        }else{
            setIntype("password");
        }
    }

    const goToDeleteAccount = ()=>{
        navigate("/delete")
    }
  return (
    <>
    <Navbar/>
    <p className="update-text">Update Name</p>
    <form className='update-form'>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={user && user.name} onChange={handleChange}/>
        <button onClick={changeName}>Update</button>
    </form>
    <p className="update-text">Update Username</p>
    <form className='update-form'>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={user && user.username} onChange={handleChange}/>
        <button onClick={changeUsername}>Update</button>
    </form>
    <p className="update-text">Update Password</p>
    <form className='update-form'>
        <label htmlFor="oldpassword">Enter Current Password</label>
        <input type={intype} name="oldpassword" value={user && user.oldpassword} onChange={handleChange}/>
        <label htmlFor="coldpassword">Confirm Current Password</label>
        <input type={intype} name="coldpassword" value={user && user.coldpassword} onChange={handleChange}/>
        <label htmlFor="newpassword">Enter New Password</label>
        <input type={intype} name="newpassword" value={user && user.newpassword} onChange={handleChange}/> 
        <div className="showPassword">
            <input type="checkbox" id="checkbox" onChange={changeIntype}/>
            <p className="showpassword">Show Password</p>
        </div>
        <button onClick={changePassword}>Update</button>
    </form>
    <p className="delete-text" onClick={goToDeleteAccount}>Delete my Account</p>
    </>
  )
}

export default ProfileUpdate