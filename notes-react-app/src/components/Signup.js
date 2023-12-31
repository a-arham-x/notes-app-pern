import React from 'react'
import "../styles/utils.css"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {

    const [intype, setIntype] = useState("password");
    const [user, setUser] = useState({name: "", username: "", password: "", cpassword:''});

    const navigate = useNavigate();

    const host = process.env.REACT_APP_SERVER;

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

    const signUp = async (e)=>{
        e.preventDefault();
        const url = `${host}/users/signup`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        const json = await response.json();
        if (json.success){
            localStorage.setItem("user-token", json.token)
            navigate("/home")
        }else{
            console.log(json.message)
        }
    }
    return (
        <>
            <h1>Notesbase</h1>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={user.username} onChange={handleChange}/>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={user.name} onChange={handleChange}/>
                <label htmlFor="password">Password</label>
                <input type={intype} name="password" value={user.password} onChange={handleChange}/>
                <label htmlFor="cpassword">Confirm Password</label>
                <input type={intype} name="cpassword" value={user.cpassword} onChange={handleChange}/>
                <div className="showPassword">
                    <input type="checkbox" id="checkbox" onChange={changeIntype}/>
                    <p className="showpassword">Show Password</p>
                </div>
                <button onClick={signUp}>Sign Up</button>
            </form>
            <pre>Already have an account? <Link to="/">Log In</Link></pre>
        </>
    )
}

export default Signup   