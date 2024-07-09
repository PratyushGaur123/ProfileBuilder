import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFaceSadCry, faXmarkCircle } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const EmptyInbox = () => {
    const [createChat, setCreateChat] = useState(false);
    const [friends, setFriends] = useState([]);
    const [noFriends, setNoFriends] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState('');
    const navigate = useNavigate();

    async function handleCreateChat() {
        if (noFriends) {
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/users/friends', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const friends = response.data.data.friends;

            if (response.status == 200) {
                console.log(friends);
                if (friends.length === 0) {
                    setNoFriends(true);
                } else {
                    setFriends(friends);
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                  alert('Authentication is required');
                  localStorage.clear();
                  navigate('/signin');
                } else {
                  alert('Internal Server Error: 500' );
                }
              }
              else if (!error.response && error.request) {
                alert("Network error. Please check your internet connection.");
              }
              else {
                alert("An unexpected error occurred. Please try again later.");
              }

        }
        setCreateChat((createChat) => !createChat);
    }

    async function handleFriendChat(e) {
        //TODO: create chat 
    }

    return (
        !createChat ? (
            <div className="min-h-screen bg-[#121212]">
                <div className="flex h-full min-h-screen w-full flex-col items-center justify-center px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-white">
                        <FontAwesomeIcon icon={faFaceSadCry} style={{ color: "#ffffff", }} className='h-12 w-12' />
                        <h1 className="text-4xl font-extrabold md:text-6xl">No chats found!</h1>
                        <p className="max-w-sm text-xs text-gray-200 md:text-sm">Try to initiate chat with your friends by clicking the button below</p>
                    </div>
                    <button className="mt-14 inline-flex w-max items-center bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]" onClick={handleCreateChat}>
                        <FontAwesomeIcon icon={faUserPlus} style={{ color: "#000000", }} className='mr-3' />
                        Create a chat
                    </button>
                </div>
            </div>) : (
            <div className="min-h-screen bg-[#121212]">
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-[#121212] bg-opacity-75 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-0 text-center md:items-center md:p-2">
                            <div className="relative w-full transform overflow-hidden border-t-[1px] border-white bg-[#121212] text-left text-white transition-all md:my-8 md:w-full md:max-w-5xl md:border-[1px]">
                                <div className="flex items-center justify-between border-b-[1px] border-white p-4">
                                    <p className="text-xl font-bold">Create Chat</p>
                                    <FontAwesomeIcon icon={faXmarkCircle} style={{ color: "#ffffff", }} onClick={() => setCreateChat(false)} />
                                </div>
                                <div className="flex w-full flex-col gap-4 p-4 md:gap-6 md:p-6">
                                    <div className="flex w-full flex-col items-start justify-start gap-2">
                                        <label className="text-xs text-slate-200">Select a user</label>
                                        <div className="w-full border-[1px] border-white pr-4">
                                            <select placeholder="Select a user..." autoComplete="false" className="w-full bg-[#121212] py-4 pl-4 text-white placeholder:text-gray-500 focus:outline-none" value={selectedFriend} onChange={(e)=> setSelectedFriend(e.target.value)}>
                                                <option disabled selected>Select a friend to chat with</option>
                                                {friends.map((friend, index) => <option key={index} value={friend._id}>{friend.firstName + friend.lastName}</option>)};
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex w-full flex-col items-center justify-end gap-4 md:flex-row md:gap-6">
                                        <button className="w-full bg-red-500 p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">Cancel</button>
                                        <button className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]" 
                                        onChange={handleFriendChat}>Start Chatting</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default EmptyInbox;
