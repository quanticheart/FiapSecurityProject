// noinspection JSCheckFunctionSignatures

const {getApp, host} = require("./utils");
const app = getApp()

const request = require('request');
const port = 3000

// Auth
const {auth, requiredScopes} = require('express-oauth2-jwt-bearer');
const checkScopes = requiredScopes('openid');
const checkJwt = auth({
    audience: 'http://localhost:4200',
    issuerBaseURL: `https://dev-5b04zxtm.us.auth0.com`,
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Implement https
const fs = require('fs');
const https = require('https');
let privateKey = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
let certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');
let credentials = {key: privateKey, cert: certificate};
let httpsServer = https.createServer(credentials, app);

app.get('/products', checkJwt, checkScopes, async (req, res) => {
    request(`${host}:3001/products`, function (err, body) {
        return res.json(JSON.parse(body.body));
    });
});

app.post('/buy', checkJwt, checkScopes, async (req, res) => {
    request({
        url: `${host}:3002/orders`,
        headers: {'content-type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(req.body)
    }, function (error, response, body) {
        if (error) {
            return res.json(error);
        } else {
            let resp = JSON.parse(body);
            resp.status = response.statusCode;
            return res.json(resp);
        }
    });
});

httpsServer.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});