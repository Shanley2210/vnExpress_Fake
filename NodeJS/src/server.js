const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Định nghĩa route mẫu
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Nhận port từ biến môi trường hoặc mặc định 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});
