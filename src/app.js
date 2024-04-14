require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
// const swaggerDocs = require ('../swagger')
const indexRouter = require('./routes/index.router');

// const {
//   addUser, findUser, getRoomUsers, removeUser,
// } = require('./users');

const app = express();
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const { PORT, SECRET_KEY_SESSION } = process.env;
// const sessionConfig = {
//   name: 'cookieName', 
//   store: new FileStore(),
//   secret: process.env.SECRET_KEY_SESSION ?? 'Mellon', 
//   resave: false, 
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 24 * 1000 * 60 * 60, 
//     httpOnly: true,
//   },
// };

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

// app.use(session(sessionConfig));

app.use('/api', indexRouter);

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
