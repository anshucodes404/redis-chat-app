import {Server} from "socket.io"
import Redis from "ioredis";
import "../dotEnvConfig"


console.log(process.env.REDIS_HOST)
console.log(process.env.REDIS_PORT)
console.log(process.env.REDIS_PASSWORD)

const pub = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    username: "default",
    password: process.env.REDIS_PASSWORD,
})
const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    username: "default",
    password: process.env.REDIS_PASSWORD,
})

//creating a class for Socket Service

class SocketService {
    private _io: Server;

    constructor(){
        console.log("Init socket service...")
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"], 
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        sub.subscribe("MESSAGES") //the servers are subscribing to the messages channel on redis
    }

    public initListeners(){
        const io = this.io;
        console.log("initialise socket listeners")
        io.on("connect", (socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on("event:message", async({message, senderId}: {message: string, senderId: string}) => {
                console.log("New msg recieved: ", message)

                //publish this message to redis
                await pub.publish("MESSAGES", JSON.stringify({message, senderId}))
            })
        })

        sub.on("message", (channel, message ) => {
            if(channel === "MESSAGES"){ //then broadcast to all connected clients
                io.emit("message", message)
            }
        })
    }

    get io(){
        return this._io;
    }
}

export default SocketService;