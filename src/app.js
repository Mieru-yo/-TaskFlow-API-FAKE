const express = require('express');
const app = express();

app.use(express.json());

app.use('/', require('./routes/health'));
app.use('/api/tasks', require('./routes/tasks'));

module.exports = app;
