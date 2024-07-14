import { createContext, useContext } from "react";
import useFetchPosts from "../Hooks/useFetchPosts";
import axios from "axios";
import { useState } from "react";


const postContext = createContext();

export function usePostContext(){
    return useContext(postContext);
}


function PostProvider({ children }) {
    const [text, setText] = useState('');
    const [post, setPost] = useState(null);
    const { posts, setPosts } = useFetchPosts();

    async function handlePostCreate() {
        if (text.trim().length === 0) {
            alert("Please enter a post");
            return;
        } else { 
            try {
                const res = await axios.post('http://localhost:8000/users/posts/create', {
                    text,
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.status === 200) {
                    let post = res.data.data.post;
                    setPosts([post, ...posts]);
                }
            } catch (error) {
                console.log(`Error in creating post`);
            }
            setText('');
        }
    }

    async function handlePostDelete(postId) {
        try {
            const res = await axios.delete(`http://localhost:8000/users/posts/delete/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                let newPosts = posts.filter((post) => post._id !== postId);
                setPosts(newPosts);
            }
        } catch (error) {
            alert('Post could not be deleted');
        }
    }

    async function handlePostLike(postId) {
        if (!postId) {
            return;
        }
        try {
            const res = await axios.post('http://localhost:8000/users/like', {
                likeAbleId: postId,
                type: 'Post'
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.status === 200) {
                const { likeCount, deleted } = res.data.data;
                const postIndex = posts.findIndex((post) => post._id === postId);
                if (postIndex !== -1) {
                    const newPosts = [...posts];
                    deleted === true ? newPosts[postIndex].isLiked = false : newPosts[postIndex].isLiked = true;
                    newPosts[postIndex].likes = likeCount;
                    setPosts(newPosts);
                }
            }

        } catch (error) {
            console.log('The post could not be liked');
        }
    }

    return (
        <postContext.Provider value={{ text, setText, posts, setPosts, post, setPost, handlePostCreate, handlePostDelete, handlePostLike}}>
            {children}
        </postContext.Provider>
    )
}

export default PostProvider;