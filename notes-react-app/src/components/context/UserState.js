import userContext from "./userContext";

const UserState = (props)=>{
    const host = process.env.REACT_APP_SERVER;

    const getUser = async ()=>{
        const url = `${host}/users/info`;
        const response = await fetch(url, {
          method: "GET",
          headers:{
            "user-token": localStorage.getItem("user-token")
          }
        });
        const json = await response.json(); 
        return json;
    }

    const updateName = async (name)=>{
      const url = `${host}/users/updatename`;
      const response = await fetch(url, {
        method: "PUT",
        headers:{
          "Content-Type": "application/json",
          "user-token": localStorage.getItem("user-token")
        },
        body: JSON.stringify({name})
      });
      const json = await response.json(); 
      return json;
    }

    const updateUsername = async (username)=>{
      const url = `${host}/users/updateusername`;
      const response = await fetch(url, {
        method: "PUT",
        headers:{
          "Content-Type": "application/json",
          "user-token": localStorage.getItem("user-token")
        },
        body: JSON.stringify({username})
      });
      const json = await response.json(); 
      return json;
    }

    const updatePassword = async (oldpassword, coldpassword, newpassword)=>{
      const url = `${host}/users/updatepassword`;
      const response = await fetch(url, {
        method: "PUT",
        headers:{
          "Content-Type": "application/json",
          "user-token": localStorage.getItem("user-token")
        },
        body: JSON.stringify({oldpassword, coldpassword, newpassword})
      });
      const json = await response.json(); 
      return json;
    }

    const deleteAccount = async (username, password, cpassword)=>{
      const url = `${host}/users/delete`;
      const response = await fetch(url, {
        method: "DELETE",
        headers:{
          "Content-Type": "application/json",
          "user-token": localStorage.getItem("user-token")
        },
        body: JSON.stringify({username, password, cpassword})
      });
      const json = await response.json(); 
      return json;
    }

    return (
        <userContext.Provider value={{getUser, updateName, updateUsername, updatePassword, deleteAccount}}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;