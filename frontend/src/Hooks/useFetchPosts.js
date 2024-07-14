import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUserContext } from '../Contexts/UserContext';

const useFetchPosts = () => {
    const [posts, setPosts] = useState([]);
    const {user} = useUserContext();

    useEffect(() => {
        async function fetchPosts() {
            if(!user){
                return;
            }
            try {
                const res = await axios.get('http://localhost:8000/users/posts', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (res.status === 200) {
                    const postArray = res.data.data.posts;
                    postArray.map((post) => {
                        return {
                            ...post,
                            isLiked: false,
                        }
                    });
                    setPosts(postArray);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchPosts();

    }, [user]);

    return { posts, setPosts };

}

export default useFetchPosts;
