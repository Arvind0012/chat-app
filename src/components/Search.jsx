import React, { useContext, useState } from 'react'

import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../Firebase';
import { AuthContext } from '../context/AuthContext';

const Search = () => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(null);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data());
      });

    }
    catch (err) {
      // alert(err)
      setErr(true)
    }
  }

  const handleKey = (e) => {
    (e.key == "Enter") && handleSearch();
  }

  // after search select the user
  const { currentUser } = useContext(AuthContext);
  const handleSelect = async () => {
    //check whether the group (chats in firestore) exist, if not create
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        });
      }
    }
    catch (err) {
    }
    setUser(null)
    setUsername("")

  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" onKeyDown={(e) => handleKey(e)} onChange={(e) => setUsername(e.target.value)} placeholder='Hit enter to search...' value={username} style={{ borderBottom: '1.1px solid white' }} />
      </div>
      {err && <span>User not found!!</span>}
      {(user) ? (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>) : ((username) ? (<span style={{ color: 'red', margin: '10px' }}>User not found !!</span>) : (""))}
    </div>
  )
}

export default Search
