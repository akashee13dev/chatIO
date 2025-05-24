const express = require("express")
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));
const expressServer = app.listen(8000, () => {});

app.get("/users", (req, res) => {
    res.send(Array.from(users));
})
const socketio = require("socket.io");
const io = socketio(expressServer, {});

const socketToUser = new Map();
const users = new Set();
const messageData = new Set();

io.on("connection", (socket) => {
    const userName = socket.handshake.query.name;
    if (!userName || userName === "null") {
        console.log("Invalid user tried to connect");
        socket.disconnect();
        return;
    }
    console.log(`User connected: ${userName}`);
    socketToUser.set(socket.id, userName);
    const userAlreadyConnected = [...socketToUser.values()].filter(u => u === userName).length > 1;

    if (!userAlreadyConnected) {
        users.add(userName);
        console.log(`New user added: ${userName}`);
        io.emit("addUsers", Array.from(users));
    } else {
        socket.emit("addUsers", Array.from(users));
    }
    if(messageData.size > 0){
        socket.emit("populateOldData",Array.from(messageData));
    }

    socket.on("logout", () => {
        console.log(`Logout: ${userName}`);
        socketToUser.delete(socket.id);

        // If no more sockets with this user
        if (![...socketToUser.values()].includes(userName)) {
            users.delete(userName);
            io.emit("removeUsers", userName);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Disconnected: ${userName}`);
        socketToUser.delete(socket.id);

        if (![...socketToUser.values()].includes(userName)) {
            users.delete(userName);
            io.emit("removeUsers", userName);
        }
    });

    
    socket.on("sendMessage", (message) => {
        console.log(`Message Received to Server : ${message}`);
        console.log(`Sending to all clients : ${message}`);
        let data = {
            "user": socketToUser.get(socket.id),
            "message": message,
            "Time": formatMessageTime()
        }
        io.emit("sendMessageFromServer", data);
        messageData.add(data);
        console.log(`Sent`);
    });

    
});

function formatMessageTime(date = new Date()) {
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    if (isToday) {
        return `Today, ${timeStr}`;
    } else {
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return `${dateStr}, ${timeStr}`;
    }
}
