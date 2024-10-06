import React, { useContext, useEffect, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, database, db, storage } from '../Firebase';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';

import { v4 as uuid } from 'uuid';
import SendIcon from '@mui/icons-material/Send';
import { set, ref, get, child, onValue } from 'firebase/database';


const Input = () => {

  const [isTyping, setIsTyping] = useState(false);

  const [text, setText] = useState("")
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)
  // console.log("data", data);
  // console.log("c-user", currentUser);

  // to get current time in hh:mm am/pm format
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });


  const [blankinput, setBlankInput] = useState(false)
  const handleSendCheck = () => {
    text || img ? handleSend() :
      setBlankInput(true)

  }

  const handleSend = async () => {

    setIsTyping(false)
    // console.log(text);
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: currentTime,
                img: downloadURL,
              })
            })
          });
        }
      );

    }
    else {
      // console.log(text);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          date: currentTime,
        })
      })
    }

    // update userchats collection with last-message for sender user
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // update userchats collection with last-message for reciever user
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("")
    setImg(null)
  };

  const handleKey = async (e) => {
    (e.key == "Enter") && handleSendCheck();

    // for typing effect
    if (/[a-zA-Z]/.test(e.key)) {
      setIsTyping(true);
    }

  }

  const writeUserData = (isTyping) => {
    const reference = ref(database, 'chats/')

    set(reference, {
      ChatsId: data.chatId,
      sender: currentUser.displayName,
      reciever: data.user.displayName,
      typing: isTyping
    })
    handleFocus()
  }

  // for typing effect 
  useEffect(() => {
    writeUserData(isTyping);

    if (!isTyping) return;

    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isTyping]);

  const [status, setStatus] = useState({})
  const handleFocus = () => {
    get(child(ref(database), 'chats')).then(snapshot => {
      // console.log(snapshot.val().typing);
      // console.log(snapshot.val().user != data.user.displayName);
      setStatus(snapshot.val());
    })
  }
  console.log(status);

  // console.log(currentUser);
  return (
    <div className='input'>
      {
        (blankinput || img) ? (
          <div className="blank-input">
            <span style={{ position: 'absolute', bottom: '5rem', left: '29.8rem', padding: '2px 8px', backgroundColor: '#f0eade', width: '46.6%', borderRadius: '0px 10px 0px 0px', color: '#6c6565' }}>{img ? img.name : "Please type a message to continue."} </span>
          </div>
        ) : ""
      }
      {/* to show typing effect... */}
      {

        (status.typing && currentUser.displayName == status.reciever) ?
          <p style={{ position: 'absolute', top: '75px', left: '34.5rem', color: 'white', fontSize: '10px' }}>typing...</p>
          : ""
      }
      <input type="text" placeholder='Type something...' onChange={e => setText(e.target.value)} value={text} onKeyDown={(e) => handleKey(e)} onFocus={handleFocus} />
      <div className="send">
        <img src="" alt="" />
        <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} onKeyDown={(e) => handleKey(e)} />
        <label htmlFor="file">
          <AddPhotoAlternateIcon style={{ color: 'gray', cursor: 'pointer', margin: '6px 13px', fontSize: '1.7rem' }} />
        </label>
        <button onClick={handleSendCheck}><SendIcon style={{ position: 'relative', left: '2', color: 'white' }} /></button>
      </div>
    </div>

  )
}

export default Input