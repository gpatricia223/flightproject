require('dotenv').config();

const express = require('express');

const PORT = process.env.PORT || 3000;
const server = express();

const apiRouter = require('./api');
const morgan = require('morgan');
const bodyParser = require('body-parser');

server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use((req, res, next) => {
    console.log('<----Body Logger START---->');
    console.log(req.body);
    console.log('<----Body Logger END ---->');

    next();
});

server.use(express.static(path.join(_dirname, '../dist')));

server.use('/api', apiRouter);

server.get('*', (req, res, next) => {
    res.sendFile(path.join(_dirname, '../dist/index.html'))
});

server.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`)
});