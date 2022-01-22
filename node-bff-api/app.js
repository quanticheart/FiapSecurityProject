const {getApp, host} = require("./utils");
const app = getApp()

const request = require('request');
const port = 3000

app.get('/products', async (req, res, next) => {
    request(`${host}:3001/products`, function (err, body) {
        return res.json(JSON.parse(body.body));
    });
});

app.post('/buy', async (req, res, next) => {
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


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});

// require('utils');
// const request = require('request');
//
// const app = getApp()
// const port = 3000
//
// app.get('/products', async (req, res, next) => {
//     request(`${host}:3001/products`, function(err, body){
//         return res.json(JSON.parse(body.body));
//     });
// });
//
// app.post('/buy', async (req, res, next) => {
//     request({
//         url: `${host}:3002/orders`,
//         headers: {'content-type' : 'application/json'},
//         method: 'POST',
//         body: JSON.stringify(req.body)
//     }, function(error, response, body){
//         if(error) {
//             console.log(error);
//         } else {
//             console.log(response.statusCode, body);
//             let resp = JSON.parse(body);
//             resp.status = response.statusCode;
//             return res.json(resp);
//         }
//     });
// });
//
//
// app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}`)
// });

