const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRoutes = require('./routes/index.routes');
const usersRoutes = require('./routes/users.routes');
const loginRoutes = require('./routes/login.routes');

app.use('/', indexRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);

module.exports = app;