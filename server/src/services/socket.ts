import { Server } from "socket.io";
import Redis from 'ioredis';

const pub = new Redis({
    host: 'redis-17442e30-abhiolics-3f07.a.aivencloud.com',
    port: 21076,
    username: 'default',
    password: 'AVNS_lZaHc-7R9z3HsBkIqTu'
});
const sub = new Redis({
    host: 'redis-17442e30-abhiolics-3f07.a.aivencloud.com',
    port: 21076,
    username: 'default',
    password: 'AVNS_lZaHc-7R9z3HsBkIqTu'
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        sub.subscribe("MESSAGES")
    }

    public initListeners() {
        const io = this.io;
        console.log("Init Socket Listeners...");
        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id);

            socket.on('event:message', async ({message} : {message: string}) => {
                console.log('New Message Recived', message)
                // publish this message to redishh
                await pub.publish("MESSAGES", JSON.stringify({ message}));
            })
        })

        sub.on("message", (channel, message) => {
            if( channel === "MESSAGES"){
                console.log("new message from redis", message);
                io.emit("message", message);
            }
        })
    }

    get io(){
        return this._io;
    }
}


export default SocketService;
