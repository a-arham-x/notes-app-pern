import React, { useContext } from 'react'
import "../styles/utils.css"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import notesContext from './context/notesContext'
import Note from './Note'

function HomePage(props) {
  const navigate = useNavigate()
  const context = useContext(notesContext);
  const { getNotes } = context;

  const [notes, setNotes] = useState();

  const fetchNotes = async () => {
    setNotes(await getNotes())
  }

  useEffect(() => {
    if (!localStorage.getItem("user-token")) {
      navigate("/");
    } else {
      fetchNotes();
    }
  }, []);
  return (
    <>
      <Navbar />
      <h1>Your Notes Gallery</h1>
      <div className="all-notes">
        {notes && notes.notes.map((note) => {
          return <Note key={note.note_id} note={note} fetchNotes={fetchNotes} changeNote={props.changeNote}/>
        })}
      </div>
    </>
  )
}

export default HomePage