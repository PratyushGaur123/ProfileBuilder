import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../Contexts/UserContext';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import EmptyInbox from './EmptyInbox';

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [noConversation, setNoConversation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if(noConversation){
      return;
    }

    setLoading(true);
    async function getConversations() {
      console.log('conv fetch hori h  ')
      try {
        const response = await axios.get(
          `http://localhost:8000/users/inbox/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.status === 200) {
          const {chat} = response.data.data;
          if(chat.length === 0){
            setNoConversation(true);
          }else{
            setConversations(chat);
          }
          setLoading(false);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert('Authentication is required');
            localStorage.clear();
            navigate('/signin');
          } else {
            alert('Error' + error.response.status + error.response.data);
          }
        }
        else if (!error.response && error.request) {
          alert("Network error. Please check your internet connection.");
        }
        else {
          alert("An unexpected error occurred. Please try again later.");
        }
        setLoading(false);
      }
    }
    getConversations();


  }, []);

  function handleConversation(conversationId){
    navigate(`chat/${conversationId}`);
    setSelectedConversation(true); 
  }



  return (
    loading ? <div> Loading </div> : (noConversation ?  <EmptyInbox/>:
      <div className="bg-[#121212]">
        <div className="mt-[77px] flex h-[calc(100vh-77px)] w-full items-center justify-center overflow-hidden p-0 md:mt-[83px] md:h-[calc(100vh-83px)]">
          <button
            className="peer fixed h-full w-full md:hidden"
            aria-label="mobile-chatlist-toggler"
            aria-details="Remove when using in your project. Following button is only to toggle chatlist sidebar"></button>
          <div className="fixed right-full top-[77px] z-10 h-full w-full border-white bg-[#121212] transition-all duration-300 ease-in-out peer-focus:right-0 md:static md:block md:w-[30%] md:border-r-[1px]">
            <ul className="flex h-[calc(100%-140px)] w-full flex-col items-start justify-start divide-y-[1px] divide-white overflow-y-auto md:h-[calc(100%-73px)]">
              {conversations.map((conversation, index) => (
                <li className="w-full cursor-pointer p-4 hover:bg-[#232323] md:p-6" key={index} onClick={()=>handleConversation(conversation._id)}>
                  <div className="flex w-full items-start justify-start gap-3 md:gap-4">
                    <img
                      className="flex aspect-square h-10 w-10 flex-shrink-0 rounded-full object-cover"
                      src="https://images.pexels.com/photos/18096595/pexels-photo-18096595/free-photo-of-music-on-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="avatar" />
                    <div className="flex w-full flex-col items-start justify-start gap-1 truncate text-ellipsis">
                      <div className="flex w-full items-center justify-between text-[10px] md:text-xs">
                        {conversation.participants.map((participant, i) => {
                          if (participant._id !== user._id) { 
                            return <p className="text-gray-400" key={i}> {participant.firstName} {participant.lastName}  </p>
                          }
                        })} 
                        {/* <p className="text-gray-400">2 hours ago</p> */}
                      </div>
                      <p className="text-xs text-white md:text-sm"> {conversation.latestMessage.message} </p>
                    </div>
                  </div>
                </li>
              ))}
              
            </ul>
          </div>

          {!selectedConversation ? <div className="flex items-center justify-center h-full w-full md:w-[70%] text-white text-center text-2xl">
    Please select a conversation
  </div> : <Outlet/>}

 
        </div>
      </div>)

  )
}

export default Inbox;
