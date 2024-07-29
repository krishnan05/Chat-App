const express = require("express");
const app = express(); 
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
// import { v4 as uuidV4 } from 'uuid';
const { v4: uuidV4 } = require("uuid");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoute);

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connection Successful!");
}).catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

const onlineUsers = new Map();
const userGroupMap = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieved", data.message);
        }
    });

    socket.on("join-group", ({ userId, groupId }) => {
        socket.join(groupId);
        
        if (!userGroupMap.has(groupId)) {
            userGroupMap.set(groupId, [userId]);
            
        } else {
            const usersInGroup = userGroupMap.get(groupId);
            if (!usersInGroup.includes(userId)) {
                usersInGroup.push(userId);
                userGroupMap.set(groupId, usersInGroup);
            }
        }

        socket.emit("group-added", { userId, groupId });
    });

    socket.on("send-group-msg", (data) => {
        const sender = data.sender;
        const usersInGroup = userGroupMap.get(data.group);
        if (usersInGroup) {
            usersInGroup.forEach((userId) => {
                const userSocketId = onlineUsers.get(userId);
                if (userSocketId) {
                    socket.to(userSocketId).emit("groupMessage", { sender, message: data.message });
                }
            });
        } else {
            console.log(`No users found in group ${data.group}`);
        }
    });

	// socket.on("disconnect", () => {
	// 	socket.broadcast.emit("callEnded")
	// });

    socket.on('join-room', (userData) => {
        const { roomID, userID } = userData;
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('new-user-connect', userData);
        socket.on('disconnect', () => {
            socket.to(roomID).broadcast.emit('user-disconnected', userID);
        });
    });
    // socket.on("offer", ({ offer, to }) => {
    //     const receiverSocketId = onlineUsers.get(to);
    //     if (receiverSocketId) {
    //       socket.to(receiverSocketId).emit('offer', { offer, from: socket.id });
    //     }
    //   });
    
    //   // Handle incoming answer
    //   socket.on("answer", ({ answer, to }) => {
    //     const receiverSocketId = onlineUsers.get(to);
    //     if (receiverSocketId) {
    //       socket.to(receiverSocketId).emit('answer', answer);
    //     }
    //   });
    
    //   // Handle ICE candidates
    //   socket.on("ice-candidate", ({ candidate, to }) => {
    //     const receiverSocketId = onlineUsers.get(to);
    //     if (receiverSocketId) {
    //       socket.to(receiverSocketId).emit('ice-candidate', candidate);
    //     }
    //   });
    
    //   // Handle call end
    //   socket.on("end-call", ({ to }) => {
    //     const receiverSocketId = onlineUsers.get(to);
    //     if (receiverSocketId) {
    //       socket.to(receiverSocketId).emit('call-ended');
    //     }
    //   });
    
    //   // Handle disconnect
    //   socket.on("disconnect", () => {
    //     console.log('Client disconnected:', socket.id);
    //     onlineUsers.forEach((socketId, userId) => {
    //       if (socketId === socket.id) {
    //         onlineUsers.delete(userId);
    //       }
    //     });
    //   });
     // Handle signaling messages
  socket.on('offer', ({ offer, to }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('offer', { offer, from: socket.id });
    }
  });

  socket.on('answer', ({ answer, to }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('answer', { answer });
    }
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice-candidate', { candidate });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    console.log('A user disconnected');
  });
});

app.get('/join', (req, res) => {
    res.send({ link: uuidV4() });
});