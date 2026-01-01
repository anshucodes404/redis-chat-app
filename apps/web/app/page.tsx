"use client"
import { useState } from "react"
import { useSocket } from "../context/SocketProvider"


export default function page() {

  const { sendMessage, messages, socket } = useSocket()
  const [message, setMessage] = useState("")

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div>
        <h1 className="text-center text-white text-2xl mt-4 font-bold">All messages will appear here</h1>
        <div>
          {
            messages?.length === 0 && (
              <p className="text-center text-gray-500 mt-50">No messages yet. Start the conversation!</p>
            )
          }
        {
          messages?.map((msg, idx) => (
            msg.senderId === socket?.id ? (
              <div key={idx} className="text-right">
                <span className="inline-block bg-blue-600 text-white rounded-md px-4 py-2 m-2">
                  {msg.message}
                </span>
              </div>
            ) : (
              <div key={idx} className="text-left">
                <span className="inline-block bg-gray-800 text-white rounded-md px-4 py-2 m-2">
                  {msg.message}
                </span>
              </div>
            )
          ))
        }
        </div>
      </div>
      <div className="flex gap-2 fixed bottom-10 left-0 right-0 max-w-3xl w-full mx-auto px-4">

        <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (sendMessage(message, socket?.id ?? ""), setMessage(""))}
        className="border text-white border-gray-300 flex-1 rounded-md px-4 py-2 focus:outline-blue-500 focus:outline-2" type="text" placeholder="type message here..." />

        <button
        onClick={() => (sendMessage(message, socket?.id ?? ""), setMessage(""))}
        className="bg-blue-600 px-4 py-2 text-white rounded-md">SEND</button>
      </div>
    </div>
  )
}