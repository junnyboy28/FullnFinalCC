// frontend/src/context/SocketContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);

    useEffect(() => {
        const socket = io("/", {
            query: {
                userId: user?._id,
            },
        });

        setSocket(socket);

        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        socket.on("newPost", (newPost) => {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        });

        socket.on("likePost", ({ postId, userId }) => {
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, likes: [...post.likes, userId] }
                        : post
                )
            );
        });

        socket.on("unlikePost", ({ postId, userId }) => {
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, likes: post.likes.filter((id) => id !== userId) }
                        : post
                )
            );
        });

        socket.on("newComment", ({ postId, comment }) => {
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, replies: [...post.replies, comment] }
                        : post
                )
            );
        });

        return () => socket && socket.close();
    }, [user?._id, setPosts]);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
