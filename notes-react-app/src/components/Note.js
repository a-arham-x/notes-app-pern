import React, { useContext } from 'react'
import "../styles/utils.css"
import notesContext from './context/notesContext'
import { useNavigate } from 'react-router-dom';

function Note(props) {
    const context = useContext(notesContext);
    const { deleteNote } = context;

    const navigate = useNavigate();

    const confirmDeletion = async (e)=>{
        if (window.confirm("Are you sure you want to delete the note?")===true){
            e.preventDefault();
            await deleteNote(props.note?.note_id)
            await props.fetchNotes();
        }
    }

    const goToEdit = ()=>{
        localStorage.setItem("note_id", props.note?.note_id)
        navigate("/edit");
    }

  return (
    <>
    <div className="note-div">
        <div className="buttons">
            <img src={require("../images/edit.png")} width="20" alt="editing pic" onClick={goToEdit}/>
            <img src={require("../images/delete.png")} width="20" alt="deleting pic" onClick={confirmDeletion}/>
        </div>
        <h2>{props.note?.title}</h2>
        <p style={{"fontWeight": 400, "fontSize": "12px"}}>{props.note?.time_created}</p>
        <p>{props.note?.content.length<=100?props.note?.content:props.note?.content.slice(0, 100) +"...."}</p>
    </div>
    </>
  )
}

export default Note