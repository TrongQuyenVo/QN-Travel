const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Route mẫu
app.get('/', (req, res) => {
    res.send('Welcome to Quang Nam Tourism API');
});


// Định nghĩa các tuyến đường
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes');
const locationRoutes = require('./routes/locationRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/locations', locationRoutes);
// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const newPort = PORT + 1;
        app.listen(newPort, () => {
            console.log(`Port ${PORT} is in use, server running on port ${newPort}`);
        });
    } else {
        console.error(err);
    }
});