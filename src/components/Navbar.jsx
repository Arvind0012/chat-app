import { signOut } from 'firebase/auth';
import React, { useContext } from 'react'
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import LoadingPage from '../Pages/LoadingPage';

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);

  return (
    <div className='navbar'>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar
