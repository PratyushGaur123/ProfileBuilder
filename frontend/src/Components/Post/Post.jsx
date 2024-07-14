import React from 'react';
import { faComment, faHeart, faBookmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserContext } from '../../Contexts/UserContext';
import { Link } from 'react-router-dom';
import { HiPaperAirplane } from "react-icons/hi2";
import maleprofile from "../../static/maleprofile.jpg";
import femaleprofile from "../../static/femaleprofile.jpg";
import { usePostContext } from '../../Contexts/PostContext';

const Post = () => {

    const {posts, setPost, handlePostCreate, handlePostDelete, handlePostLike, text, setText} = usePostContext();
    const { user } = useUserContext();

    return (
        <section className="col-span-12 md:col-span-8 lg:col-span-6">

            {/* CREATE POST */}
            <div className="mb-2 flex w-full items-center justify-start border-b border-t border-white px-4 py-2 sm:mb-6 sm:border-l sm:border-r sm:shadow-[5px_5px_0px_0px_#4f4e4e]">
                <img
                    className="flex aspect-square h-10 w-10 shrink-0 rounded-full object-cover"
                    src={user.gender === 'Male' ? maleprofile : femaleprofile}
                    alt="avatar" />
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type to add something"
                    className="w-full bg-transparent p-2 text-white !outline-none placeholder:text-gray-500 md:p-4" />
                <div className="flex gap-x-1 sm:gap-x-2">
                    <button className="flex shrink-0 items-center justify-center bg-[#f8f7fa] p-1" type='submit' onClick={handlePostCreate}>
                        <HiPaperAirplane className='h-5 w-5' />
                    </button>
                </div>
            </div>

            {/* POSTS  <FontAwesomeIcon icon="fa-solid fa-trash-can" style={{color: "#fe0b0b",}} />*/}
            {posts.map((post, index) => (
                <div className="relative mb-2 w-full last:mb-0 sm:mb-4" key={index}>
                    <div className="flex border-b border-t border-white p-4 text-white sm:border-l sm:border-r">
                        <div className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                            <img
                                src={post.user.gender === 'Male' ? maleprofile : femaleprofile}
                                alt="Mystical Wanderer"
                                className="h-full w-full rounded-full object-cover" />
                        </div>
                        <div className="pl-4 pt-1 w-full">
                            <div className="mb-2 flex items-center gap-x-2">
                                <div className="w-full">
                                    <h2 className="inline-block font-bold">{post.user.firstName + post.user.lastName}</h2>
                                    <span className="ml-2 inline-block text-sm text-gray-400">15 minutes ago</span>
                                </div>
                                {user._id === post.user._id ? (<button className="ml-auto shrink-0  text-red-500 hover:text-red-600"
                                    onClick={() => handlePostDelete(post._id)}>
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className='h-5 w-5'
                                    />
                                </button>) : null}
                            </div>
                            <p className="mb-4 text-sm sm:text-base"> {post.text} </p>
                            <div className="flex gap-x-4">
                                <button
                                    className={`group inline-flex items-center gap-x-1 outline-none ${post.isLiked ? 'text-red-600' : 'text-white hover:text-red-600 '} `}
                                    onClick={() => handlePostLike(post._id)}>
                                    <FontAwesomeIcon icon={faHeart} className="h-5 w-5 " /> {post.likes}
                                </button>
                                <Link to={`/post/${post._id}`} onClick={()=> {setPost(post)}} className="inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff]">
                                    <FontAwesomeIcon icon={faComment} flip='horizontal' className="h-5 w-5 " />
                                    <span>{post.comments.length}</span>
                                </Link>

                                <div className="ml-auto">
                                    <button className="group inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff] focus:text-[#ae7aff]">
                                        <FontAwesomeIcon icon={faBookmark} className="h-5 w-5 " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}


        </section>
    )
}

export default Post
