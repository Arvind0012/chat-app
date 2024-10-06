import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import LoadingPage from '../Pages/LoadingPage'

const Chat = () => {

  const {data} = useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)
  // console.log(currentUser);

  return (
    <div className='chat'>
      <div className="chatInfo">
        <img src={data.user?.photoURL} alt="" />
        <span>{(data.user?.displayName == currentUser.displayName) ? (
          <div className="mine">
            <span>{data.user?.displayName}</span>
            <small>Message Youself</small>
          </div>
        ): (data.user?.displayName)}</span>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
