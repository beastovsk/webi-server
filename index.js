require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const indexRouter = require('./routes/index.router');
const app = express();
const { PORT } = process.env;
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api', indexRouter);

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
