import React from 'react'
import "../styles/utils.css"
import Navbar from './Navbar'
import { useContext, useState, useEffect } from 'react'
import notesContext from './context/notesContext'
import { useNavigate } from 'react-router-dom'

function EditNote() {
    const context = useContext(notesContext);
    const { updateNote, getOneNote } = context;
    const [note, setNote] = useState({title:"", content:""});
    const navigate = useNavigate();
    // const [noteValues, setNoteValues] = useState();

    const handleChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

    const editNote = async (e) => {
        e.preventDefault();
        const json = await updateNote(localStorage.getItem("note_id"), note.title, note.content)
        console.log(json);
    }

    // const fetchNote = async () => {
    //     const fetchedNote = await getOneNote(localStorage.getItem("note_id"))?.note
    //     setNote({title: fetchedNote?fetchedNote.title:"", content: fetchedNote?fetchedNote.content:""})
    // }

    useEffect(() => {
        const fetchNote = async () => {
            const response = await getOneNote(localStorage.getItem("note_id"));
        
            if (response && response.note) {
                setNote({
                    title: response.note.title || '',
                    content: response.note.content || '',
                });
            } else {
                fetchNote();
            }
        }

        if (!localStorage.getItem("note_id")) {
            if (!localStorage.getItem("user-token")) {
                navigate("/");
            } else {
                navigate("/home");
            }
        } else {
            fetchNote();
        }
    }, [navigate, getOneNote]);
    return (
        <>
            <Navbar />
            <div className="image-div">
                <img src={require("../images/edit.png")} id="edit-image" alt="Editing Icon" />
            </div>
            <form className="editing-form">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={note && note.title} readonly={!note} onChange={handleChange}/>
                <label htmlFor="content">Content</label>
                <textarea rows="30" columns="100" id="content" name="content" value={note && note.content} readonly={!note} onChange={handleChange}/>
                <button onClick={editNote}>Update</button>
            </form>
        </>
    )
}

export default EditNote