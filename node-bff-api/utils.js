const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const RateLimit = require('express-rate-limit');

exports.host = process.env.DOCKER_HOST_IP || 'http://localhost';
exports.getApp = function () {
    const app = express()

    const limiter = new RateLimit({
        windowMs: 15 * 60 * 1000,
        max: 50,
        delayMs: 0,
        message: "Too many accounts created from this IP, please try again after an hour"
    });

    app.use(limiter);
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.json());
    app.use(cookieParser());

    return app;
}