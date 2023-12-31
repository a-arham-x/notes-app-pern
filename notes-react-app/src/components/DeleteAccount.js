import React from 'react'
import "../styles/utils.css"
import Navbar from './Navbar'
import { useState } from 'react'
import userContext from './context/userContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DeleteAccount() {

    const context = useContext(userContext)
    const {deleteAccount} = context;
    const navigate = useNavigate();

    const [user, setUser] = useState({username: "", password: "", cpassword: ""})

    const [intype, setIntype] = useState("password");

    useEffect(() => {
        if (!localStorage.getItem("user-token")) {
          navigate("/");
        }
      }, []);

    const delAccount = async (e)=>{
        if (window.confirm("Are you sure you want to delete your account?")===true){
            e.preventDefault();
            await deleteAccount(user.username, user.password, user.cpassword);
            localStorage.setItem("user-token", "");
            navigate("/")
        }
    }

    const handleChange = (e)=>{
        setUser({...user, [e.target.name]: e.target.value})
    }

    const changeIntype = ()=> {
        if (intype==="password"){
            setIntype("text");
        }else{
            setIntype("password");
        }
    }
    return (
        <>
            <Navbar/>
            <h1>Delete Acccount </h1>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={user.username} onChange={handleChange}/>
                <label htmlFor="password">Password</label>
                <input type={intype} name="password" value={user.password} onChange={handleChange}/>
                <label htmlFor="cpassword">Confirm Password</label>
                <input type={intype} name="cpassword" value={user.cpassword} onChange={handleChange}/>
                <div className="showPassword">
                    <input type="checkbox" id="checkbox" onChange={changeIntype}/>
                    <p className="showpassword">Show Password</p>
                </div>
                <button onClick={delAccount}>Delete</button>
            </form>
        </>
    )
}

export default DeleteAccount