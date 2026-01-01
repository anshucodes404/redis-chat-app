"use client"

import React, { useCallback, useContext, useEffect, useState } from "react"
import {io, Socket} from "socket.io-client"

interface SocketProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (message: string, senderId: string) => any;
    messages?: IMessagePayload[];
    socket?: Socket | null;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

interface IMessagePayload {
    message: string;
    senderId: string;
}

export const useSocket = () => {
    const state = useContext(SocketContext)

    if(!state) throw new Error("State is undefined in useSocket")
    
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<IMessagePayload[]>([])
    const sendMessage: ISocketContext["sendMessage"] = useCallback((message: string, senderId: string) => {
        console.log("Message sending: ", message)
        if(socket){
            socket.emit("event:message", {message, senderId})
            console.log(socket.id)
        }
    }, [socket])

    const onMessageRecieved = useCallback((message: string) => {
        console.log("From server Msg Recieved", message)
        const msg: IMessagePayload = JSON.parse(message)
        setMessages((prev) => [...prev, msg])
    }, [])

    useEffect(() => {
        const _socket = io("http://localhost:8000"); //creates the connection
        _socket.on("message", onMessageRecieved)
        setSocket(_socket)
        return () => { //cleaning up
            _socket.disconnect();
            _socket.off("message", onMessageRecieved)
            setSocket(null)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, messages, socket }}>
            {children}
        </SocketContext.Provider>
    )
}