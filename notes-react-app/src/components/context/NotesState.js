import notesContext from "./notesContext";

const NotesState = (props)=>{
    const host = process.env.REACT_APP_SERVER;

    const addNote = async (title, content)=>{
      const url = `${host}/notes/create`;
        const response = await fetch(url, {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user-token")
          },
          "body": JSON.stringify({title, content})
        });
        const json = await response.json(); 
        return json;
    }

    const getNotes = async ()=>{
        const url = `${host}/notes/get`;
        const response = await fetch(url, {
          method: "GET",
          headers:{
            "user-token": localStorage.getItem("user-token")
          }
        });
        const json = await response.json(); 
        return json;
    }

    const getOneNote = async (note_id)=>{
      const url = `${host}/notes/get/${note_id}`;
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers:{
          "user-token": localStorage.getItem("user-token")
        }
      });
      const json = await response.json();
      console.log(json.note) 
      return json;
  }

    const deleteNote = async (note_id)=>{
      const url = `${host}/notes/delete`;
        const response = await fetch(url, {
          method: "DELETE",
          headers:{
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user-token")
          },
          "body": JSON.stringify({note_id})
        });
        const json = await response.json(); 
        return json;
    }

    const updateNote = async (note_id, title, content)=>{
      const url = `${host}/notes/edit`;
        const response = await fetch(url, {
          method: "PUT",
          headers:{
            "Content-Type": "application/json",
            "user-token": localStorage.getItem("user-token")
          },
          "body": JSON.stringify({note_id, title, content})
        });
        const json = await response.json(); 
        return json;
    }

    return (
        <notesContext.Provider value={{getNotes, deleteNote, addNote, updateNote, getOneNote}}>
            {props.children}
        </notesContext.Provider>
    )
}

export default NotesState;