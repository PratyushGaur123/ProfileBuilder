import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client"
import UserProvider, { useUserContext } from "./UserContext";

const socketContext = createContext();

export const useSocketContext = () => {
    const value = useContext(socketContext);
    return value;
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [getOnlineUsers, setGetOnlineUsers] = useState(null);
    const { user } = useUserContext();

    useEffect(() => {
        if (user) {
            const socket = io("http://localhost:8000", {
                query: {
                    userId: user._id
                }

            });

            console.log('socket connection bn gya');

            socket.on('connect', () => {
                setSocket(socket);
            });

            socket.on('getOnlineUsers', (users) => {
                console.log('Following users are online: '+ users );
                console.log(typeof(users));
                console.log('length: ' + + users.length)
                setGetOnlineUsers(users);
            });

            socket.on('userOnline', (user) => {
                console.log('your friend just came online' + user);
                setGetOnlineUsers(users => [...users, user]);
            });

            socket.on('userOffline', (user) => {
                setGetOnlineUsers(users => users.filter(u => u !== user));
            });

            return () => {
                socket.close();
            }
        } else {
            if (socket) {
                socket.close();
            }
            setSocket(null);
        }

    }, [user]);


    return (
        <socketContext.Provider value={{ socket, getOnlineUsers }}>
            {children}
        </socketContext.Provider>
    )
}