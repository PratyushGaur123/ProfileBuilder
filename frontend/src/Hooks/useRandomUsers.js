import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../Contexts/UserContext';

const useRandomUsers = () => {
    const [randomUsers, setRandomUsers] = useState([]);
    const {user} = useUserContext();

    useEffect(() => {
        async function fetchRandomUsers() {
            if(!user){
                return;
            }
            try {
                const res = await axios.get('http://localhost:8000/users/random-users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (res.status === 200) {
                    const randomUsers = res.data.data.randomUsers;
                    setRandomUsers(randomUsers);
                }
            } catch (error) {
                console.log('error in fetching random users');
            }
        }
        fetchRandomUsers();

    }, []);

    return {randomUsers, setRandomUsers};
}

export default useRandomUsers;
