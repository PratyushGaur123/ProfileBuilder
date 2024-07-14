import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HiPaperAirplane } from "react-icons/hi2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, useParams } from 'react-router-dom';
import { useSocketContext } from '../../Contexts/SocketContext';




const Chat = () => {
    const [loading, setLoading] = useState();
    const [conversation, setConversation] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const {conversationId} = useParams();
    const {socket} = useSocketContext();
    const navigate = useNavigate();

    useEffect(()=>{
      socket.on('newMessage', ({message})=>{
        setMessages( (prevMessages)=> [message, ...prevMessages] )
      })

      return ()=> socket.off('newMessage');

    }, [socket]);

    useEffect(() => {
        //TODO: Add a check for user (optional)
        if (!conversationId) {
          navigate('/inbox');
            return;
        }

        if (conversation && conversationId === conversation._id) {
            return;
        }

        async function getConversation() {
            try {
                setLoading(true);
                console.log('sending a req')
                const response = await axios.get(`http://localhost:8000/users/inbox/conversation/${conversationId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const conversation = response.data.data.conversation;
                if (response.status === 200) {
                    setConversation(conversation);
                    setReceiver(conversation.participants[0]);
                    setMessages(conversation.messages);
                    setLoading(false);
                    console.log(conversation);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        alert('Authentication is required');
                        localStorage.clear();
                        //   navigate('/signin');
                    }
                    else if (error.response.status === 400) {
                        alert('Bad Request');
                    }
                    else if (error.response.status === 404) {
                        alert('The chat does not exist')
                    }
                    else {
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
                navigate('/inbox');
            }
        }
        getConversation();

    }, [conversationId]);

    async function handleSendMessage(){
      if(message.trim().length === 0){
        alert('Cant Send an Empty Messsage');
        return;
      }

      try {
        const response = await axios.post(`http://localhost:8000/users/inbox/send`, {
          receiverId: receiver._id,
          message
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if(response.status == 200){
          const {message} = response.data.data;
          setMessages( (prevMessages)=> [message, ...prevMessages] )
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert('ERROR: Authentication is required');
            localStorage.clear();
            navigate('/signin');
          } 
          else if(error.response.status === 404) {
            alert('ERROR: User does not exist');
            navigate('/home');
          }else if(error.response.status === 400){
            alert('ERROR: Necessary data not passed');
          }else{
            alert('ERROR: Internal Server Error');
          }
        }
        else if (!error.response && error.request) {
          alert("Network error. Please check your internet connection.");
        }
        else {
          alert("An unexpected error occurred. Please try again later.");
        }
        
      }
      setMessage('');
    }

    return (
        !conversation||loading ? <div className='h-full w-full md:w-[70%] text-white'> Loading </div> : (
            <div className="h-full w-full md:w-[70%]">
                <div className="flex w-full items-center justify-between gap-2 border-b-[1px] border-white p-4">
                    <div className="flex w-full items-center justify-start gap-3">
                        <img
                            className="flex aspect-square h-10 w-10 flex-shrink-0 rounded-full object-cover"
                            src="https://images.pexels.com/photos/18107024/pexels-photo-18107024/free-photo-of-an-old-city-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="avatar" />
                        <p className="font-semibold text-white"> {receiver.firstName + " " + receiver.lastName} </p>
                    </div>
                </div>
                <div className="relative h-[calc(100vh-150px)] w-full p-0 md:h-[calc(100vh-158px)] md:p-4">
                    <div className="flex h-[calc(100%-53px)] w-full flex-col-reverse gap-8 overflow-y-auto px-2 py-4 md:h-[calc(100%-90px)] md:p-0">
                        {messages.map((message, index) => {
                            if (message.sender === receiver._id) {
                                return (
                                    <div className="flex min-w-[150px] max-w-[80%] items-start justify-start gap-2 text-white md:max-w-[70%]" key={index}>
                                        <img
                                            className="flex aspect-square h-7 w-7 flex-shrink-0 rounded-full object-cover md:h-10 md:w-10"
                                            src="https://images.pexels.com/photos/18107024/pexels-photo-18107024/free-photo-of-an-old-city-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                            alt="avatar" />
                                        <div className="flex w-full max-w-[70%] flex-col gap-2">
                                            <p className="text-xs">{receiver.firstName + " " + receiver.lastName}
                                            {/* <span class="ml-2 text-gray-400">10 minutes ago</span> */}
                                            </p>
                                            <div
                                                className="relative w-fit bg-[#343434] p-3 text-sm after:absolute after:left-0 after:top-0 after:border-r-[15px] after:border-t-[15px] after:border-r-transparent after:border-t-[#121212]">
                                               {message.message}
                                            </div>
                                        </div>
                                    </div>
                                )

                            }else{
                                return (
                                    <div className="flex min-w-[150px] max-w-[80%] items-start justify-start gap-2 text-white md:max-w-[70%] ml-auto flex-row-reverse">
                                <img
                                    className="flex aspect-square h-7 w-7 flex-shrink-0 rounded-full object-cover md:h-10 md:w-10"
                                    src="https://images.pexels.com/photos/18148932/pexels-photo-18148932/free-photo-of-bench-city-man-people.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    alt="avatar" />
                                <div className="flex w-full flex-col gap-1 md:gap-2 items-end justify-end">
                                    <p className="text-[10px] md:text-xs">
                                        You
                                        {/* <span className="ml-2 text-gray-400">5 minutes ago</span> */}
                                    </p>
                                    <div
                                        className="relative w-fit p-2 text-xs after:absolute after:top-0 after:border-t-[15px] after:border-t-[#121212] md:p-3 md:text-sm bg-[#ae7aff] after:right-0 after:border-l-[15px] after:border-l-transparent">
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                                )

                            }
                        })}

                    </div>
                    <div className="sticky top-full flex w-full items-center justify-start gap-1 border-t-[1px] border-white px-4 py-2 md:gap-4 md:border-[1px] md:shadow-[5px_5px_0px_0px_#4f4e4e]">
                        <img
                            className="hidden aspect-square h-5 w-5 flex-shrink-0 rounded-full object-cover md:flex md:h-10 md:w-10"
                            src="https://images.pexels.com/photos/18148932/pexels-photo-18148932/free-photo-of-bench-city-man-people.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="avatar" />
                        <input
                            placeholder="Message..."
                            className="w-full bg-transparent p-2 text-sm text-white !outline-none placeholder:text-gray-500 md:p-4 md:text-base" value={message}  onChange={(e)=>setMessage(e.target.value)}/>
                        <button className="hidden h-5 w-5 flex-shrink-0 items-center justify-center p-1 md:flex md:h-10 md:w-10"  >
                            <FontAwesomeIcon icon={faFaceSmile} style={{ color: "#ffffff", }} className='h-5' />
                        </button>
                        <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center p-1 md:h-10 md:w-10" >
                            <FontAwesomeIcon icon={faPaperclip} style={{ color: "#ffffff", }} className='h-5' />
                        </button>
                        <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-[#f8f7fa] p-1 md:h-10 md:w-10" onClick={handleSendMessage}>
                            <HiPaperAirplane className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </div>
        )
    )
};

export default Chat;
