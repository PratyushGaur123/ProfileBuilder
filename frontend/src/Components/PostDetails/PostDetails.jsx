import React from 'react';
import { usePostContext } from '../../Contexts/PostContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faHeart, faComment, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { HiPaperAirplane } from "react-icons/hi2";
import { useUserContext } from '../../Contexts/UserContext';
import maleprofile from "../../static/maleprofile.jpg";
import femaleprofile from "../../static/femaleprofile.jpg";


const PostDetails = () => {
  const { post, handlePostLike } = usePostContext();
  const { user } = useUserContext();


  return (
    <section className="col-span-12 border-b border-t border-white sm:border-l sm:border-r md:col-span-8 lg:col-span-6">
      <div className="flex border-b border-white p-4 text-white last:border-none">
        <div className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
          <img
            src={post.user.gender === 'Male' ? maleprofile : femaleprofile}
            alt="Solar Flare "
            className="h-full w-full rounded-full object-cover" />
        </div>

        <div className="pl-4 pt-1 w-full">
          <div className="mb-2 flex items-center gap-x-2">
            <div className="w-full">
              <h2 className="inline-block font-bold">{post.user.firstName + ' ' + post.user.lastName}</h2>
              {/* <span className="ml-2 inline-block text-sm text-gray-400">59 minutes ago</span> */}
            </div>

          </div>
          <p className="mb-4 text-sm sm:text-base">{post.text}</p>

          <div className="flex gap-x-4 ">
            <button
              className={`group inline-flex items-center gap-x-1 outline-none ${post.isLiked ? 'text-red-600' : 'text-white hover:text-red-600 '} `}
              onClick={() => handlePostLike(post._id)}>
              <FontAwesomeIcon icon={faHeart} className="h-5 w-5 " /> {post.likes}
            </button>
            <button className="inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff]">
              <FontAwesomeIcon icon={faComment} flip='horizontal' className="h-5 w-5 " />
              <span>{post.comments.length}</span>
            </button>
            <div className="ml-auto">
              <button className="group inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff] focus:text-[#ae7aff]">
                <FontAwesomeIcon icon={faBookmark} className="h-5 w-5 " />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-start border-b border-white px-4 py-2 last:border-none">
        <img
          className="flex aspect-square h-10 w-10 shrink-0 rounded-full object-cover"
          src={user.gender === 'Male' ? maleprofile : femaleprofile}
          alt="avatar" />
        <input
          placeholder="Comment..."
          className="w-full bg-transparent p-2 text-white !outline-none placeholder:text-gray-500 md:p-4" />
        <div className="flex gap-x-1 sm:gap-x-2">
          <button className="flex shrink-0 items-center justify-center p-1">
            <FontAwesomeIcon icon={faFaceSmile} style={{ color: "#ffffff", }} className='h-5' />
          </button>
          <button className="flex shrink-0 items-center justify-center bg-[#f8f7fa]  p-1">
            <HiPaperAirplane className='h-5 w-5' />
          </button>
        </div>
      </div>

      <div className="relative border-b border-white last:border-none">
        <div className="flex p-4 text-white">
          {/* <div className="relative shrink-0 before:absolute before:left-1/2 before:top-[30px] before:z-[5] before:h-full before:w-[1px] before:bg-white"> */}
          <div className="relative z-10 h-10 w-10 sm:h-12 sm:w-12">
            <img
              src="https://images.pexels.com/photos/3532554/pexels-photo-3532554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Isabella Andrews"
              className="h-full w-full rounded-full object-cover" />
          </div>
          {/* </div> */}
          <div className="pl-4 pt-1">
            <div className="mb-2 flex items-center gap-x-2">
              <div className="w-full">
                <h2 className="inline-block font-bold">Isabella Andrews</h2>
                {/* <span className="ml-2 inline-block text-sm text-gray-400">58 minutes ago</span> */}
              </div>

            </div>
            <p className="mb-4 text-sm sm:text-base">Such an important mission! How can individuals contribute to this solar revolution, Solar Flare?</p>
            <div className="mb-4 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
              {/* <img
                src="https://images.pexels.com/photos/18148936/pexels-photo-18148936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="attachment-0"
                className="rounded-md" /> */}
            </div>
            <div className="flex gap-x-4 -mt-5">
              <button
                className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)] hover:text-[#ae7aff] focus:text-[#ae7aff]">
                <FontAwesomeIcon icon={faHeart} className="h-5 w-5 " />  20
              </button>
              {/* <button className="inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff]">
                ADD REPLY
                <span></span>
              </button> */}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default PostDetails
