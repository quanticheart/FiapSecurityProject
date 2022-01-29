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

// Implementa https
const fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

app.get('/products', checkJwt, checkScopes, async (req, res, next) => {
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
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            var resp = JSON.parse(body);
            resp.status = response.statusCode;
            return res.json(resp);
        }
    });
});

httpsServer.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});