import React from 'react'
import "../styles/utils.css"
import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

function Login() {
    const host = process.env.REACT_APP_SERVER;
    const [intype, setIntype] = useState("password");
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({username: "", password: ""});

    useEffect(() => {   
        if (localStorage.getItem("user-token")){
            navigate("/home ");
        }
        }, []);

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    const changeIntype = ()=> {
        if (intype==="password"){
            setIntype("text");
        }else{
            setIntype("password");
        }
    }

    const logIn = async (e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        const json = await response.json();
        console.log(json)
        if (json.success){
            localStorage.setItem("user-token", json.token)
            navigate("/home")
        }else{
            window.alert(json.message)
        }
    }

    return (
        <>
            <h1>Our Own Notes</h1>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={credentials.username} onChange={handleChange}/>
                <label htmlFor="password">Password</label>
                <input type={intype} name="password" value={credentials.password} onChange={handleChange}/>
                <div className="showPassword">
                    <input type="checkbox" id="checkbox" onChange={changeIntype}/>
                    <p className="showpassword">Show Password</p>
                </div>
                <button onClick={logIn}>Log In</button>
            </form>
            <pre>Don't have an account? <Link to="/signup">Sign Up</Link></pre>
        </>
    )
}

export default Login
