const express = require('express');
const app = express();
app.use(express.json());

let rooms = []; // Yaha saare active rooms save rahenge

// 1. Room Create karne ki API
app.post('/create_room', (req, res) => {
    const { room_name, password, host_ip, port } = req.body;
    
    const existingRoom = rooms.find(r => r.room_name === room_name);
    if (existingRoom) {
        return res.status(400).json({ success: false, message: "Room name already exists!" });
    }

    const newRoom = {
        id: Date.now().toString(),
        room_name: room_name,
        password: password || "",
        host_ip: host_ip,
        port: port || 7777
    };

    rooms.push(newRoom);
    console.log("Room Created:", room_name);
    res.json({ success: true, room: newRoom });
});

// 2. Saare Rooms ki List lene ki API
app.get('/get_rooms', (req, res) => {
    const publicRooms = rooms.map(r => ({
        room_name: r.room_name,
        has_password: r.password !== ""
    }));
    res.json(publicRooms);
});

// 3. Room Join karne aur Password verify karne ki API
app.post('/join_room', (req, res) => {
    const { room_name, password } = req.body;
    const room = rooms.find(r => r.room_name === room_name);

    if (!room) {
        return res.status(404).json({ success: false, message: "Room not found!" });
    }

    if (room.password !== "" && room.password !== password) {
        return res.status(401).json({ success: false, message: "Incorrect password!" });
    }

    res.json({ success: true, host_ip: room.host_ip, port: room.port });
});

// Render ke liye zaroori port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Matchmaking Server is running on port " + PORT);
});
          
