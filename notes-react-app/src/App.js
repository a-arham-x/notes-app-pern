import './App.css';
import Login from './components/Login';
import NotesState from './components/context/NotesState';
import UserState from './components/context/UserState';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import EditNote from './components/EditNote';
import AddNote from './components/AddNote';
import Profile from './components/Profile';
import ProfileUpdate from './components/ProfileUpdate';
import DeleteAccount from './components/DeleteAccount';

function App() {

  return (
    <>
      <UserState>
        <NotesState>
          <Router>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/home" element={<HomePage/>} />
              <Route exact path="/edit" element={<EditNote/>} />
              <Route exact path="/addnote" element={<AddNote/>}/>
              <Route exact path="/profile" element={<Profile/>}/>
              <Route exact path="/updateprofile" element={<ProfileUpdate/>}/>
              <Route exact path="/delete" element={<DeleteAccount/>}/>
            </Routes>
          </Router>
        </NotesState>
      </UserState>
    </>
  );
}

export default App;
