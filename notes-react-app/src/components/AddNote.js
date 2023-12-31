import React from 'react'
import "../styles/utils.css"
import Navbar from './Navbar'
import { useContext, useState } from 'react' 
import notesContext from './context/notesContext'
import { useNavigate } from 'react-router-dom'

function AddNote() {

    const context = useContext(notesContext)
    const {addNote} = context;
    const navigate = useNavigate();

    const [note, setNote] = useState({title: "", content: ""})

    const handleChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value});
    }

    const createNote = ()=>{
        const json = addNote(note.title, note.content)
        navigate("/home")
    }

  return (
    <>
        <Navbar/>
        {/* <div className="image-div">
            <img src={require("../images/edit.png")} id="edit-image" alt="Editing Icon" />
        </div> */}
        <form className="adding-form">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" value={note.title} onChange={handleChange}/>
            <label htmlFor="content">Content</label>
            <textarea rows="30" columns="100" id="content" name="content" value={note.content} onChange={handleChange}/>
            <button onClick={createNote}>Add Note</button>
        </form>  
    </>
  )
}

export default AddNote