import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Message = ({ message }) => {
  // console.log(message);

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)
  // console.log(data);

  // to scroll down when we send a message
  const cref = useRef();
  useEffect(() => {
    // console.log(message);
    if (message) {
      cref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  // to get current time in hh:mm am/pm format (to comapre with the date)
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });


  return (
    <div className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo recieverImg">
        {message.senderId === currentUser.uid ? <></> : <img src={data.user.photoURL} alt="" />}
      </div>

      <div className="messageContent" ref={cref} >
        <div className="messageInfo" >
          <span style={{fontWeight:'bolder'}}>{(message.date == currentTime) ? (
            <span>Just now</span>
          ) : (message.date)}</span>
        </div>
        {message.text != "" && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
