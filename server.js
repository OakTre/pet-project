const express = require('express');
const router = require('./router/router.js');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error.js');

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

module.exports = app;
