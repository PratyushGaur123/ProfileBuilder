import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {faFaceSadCry, faXmarkCircle} from '@fortawesome/free-regular-svg-icons'
import axios from 'axios';



const EmptyInbox = () => {
    const [createChat, setCreateChat] = useState(true);

    async function handleCreateChat(){
        try {
            const response = await axios.get('http://localhost:8000/users/')
        } catch (error) {
            
        }
        setCreateChat( (createChat) => !createChat );

    }

    return (
        !createChat ? (
            <div class="min-h-screen bg-[#121212]">
                <div class="flex h-full min-h-screen w-full flex-col items-center justify-center px-4 text-center">
                    <div class="flex flex-col items-center justify-center gap-4 text-white">
                    <FontAwesomeIcon icon={faFaceSadCry} style={{color: "#ffffff",}} className='h-12 w-12'/>
                        <h1 class="text-4xl font-extrabold md:text-6xl">No chats found!</h1>
                        <p class="max-w-sm text-xs text-gray-200 md:text-sm">Try to initiate chat with your friends by clicking the button below</p>
                    </div>
                    <button class="mt-14 inline-flex w-max items-center bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]" onClick={handleCreateChat}>
                    <FontAwesomeIcon icon={faUserPlus} style={{color: "#000000",}} className='mr-3'/>
                        Create a chat
                    </button>
                </div>
            </div>) : (
            <div class="min-h-screen bg-[#121212]">
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div class="fixed inset-0 bg-[#121212] bg-opacity-75 transition-opacity"></div>
                    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-0 text-center md:items-center md:p-2">
                            <div class="relative w-full transform overflow-hidden border-t-[1px] border-white bg-[#121212] text-left text-white transition-all md:my-8 md:w-full md:max-w-5xl md:border-[1px]">
                                <div class="flex items-center justify-between border-b-[1px] border-white p-4">
                                    <p class="text-xl font-bold">Create Chat</p>
                                    <FontAwesomeIcon icon={faXmarkCircle} style={{color: "#ffffff",}} onClick={handleCreateChat}/>
                                </div>
                                <div class="flex w-full flex-col gap-4 p-4 md:gap-6 md:p-6">
                                    <div class="flex w-full flex-col items-start justify-start gap-2">
                                        <label class="text-xs text-slate-200">Select a user</label>
                                        <div class="w-full border-[1px] border-white pr-4">
                                            <select placeholder="Select a user..." autoComplete="false" class="w-full bg-[#121212] py-4 pl-4 text-white placeholder:text-gray-500 focus:outline-none">
                                                <option value="0">John Doe</option>
                                                <option value="1">Jane Doe</option>
                                                <option value="2">Mark Smith</option>
                                                <option value="3">Tiger Woods</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="flex w-full flex-col items-center justify-end gap-4 md:flex-row md:gap-6">
                                        <button class="w-full bg-red-500 p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">Cancel</button>
                                        <button class="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">Start Chatting</button>
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
