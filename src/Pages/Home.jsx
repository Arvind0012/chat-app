import React, { useContext, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../Firebase'


const Home = () => {

  const { data } = useContext(ChatContext)

  if (!data) {
    return <LoadingPage />
  }
  // console.log(data);

  return (
    <div className='home'>
      <div className="container">
        <Sidebar />
        {
          data.chatId == "null" ?
            <>
              <div className='chat'>
                <div className="no-chatInfo">
                  <div className="no-chatInfo-logo">
                    <img src="/messaging.png" alt="" />
                    <h3>Talkr</h3>
                  </div>
                  <div className="no-chatInfo-msg">
                    <h4>Please select/search a user to continue...</h4>
                  </div>
                </div>
              </div>
            </> : <Chat />
        }

      </div>
    </div>
  )
}

export default Home
