require('dotenv').config();
require('./config/passport');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { sequelize } = require('./models');

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

sequelize
    .sync()
    .then(() => console.log('Cơ sở dữ liệu đã được đồng bộ hóa'))
    .catch((err) => console.error('Lỗi đồng bộ cơ sở dữ liệu:', err));

// Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api', require('./routes/comment.route'));

//
//

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port: ${PORT}`);
});
