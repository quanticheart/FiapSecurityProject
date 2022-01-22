const express = require('express')
const app = express()
const port = 3002

const db = require("./db");

const RateLimit = require('express-rate-limit');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {randomUUID} = require('crypto');

const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    delayMs: 0,
    message: "Too many accounts created from this IP, please try again after an hour"
});

app.use(limiter);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/orders', async (req, res) => {
    let resp = await db.getAllOrders();
    res.status(200).json(resp);
});

app.post('/orders', async (req, res) => {

    try {
        let id = randomUUID();
        let clientId = req.body.client_id;
        let productId = req.body.product_id
        let amount = req.body.amount

        await db.insertOrder(id, clientId, productId, amount);
        return res.status(200).json({message: 'Pedido cadastrado com sucesso!', order_id: id});

    } catch (err) {
        return res.status(err.code).json(err);
    }
});

app.get('/orders/:id', async (req, res) => {

    try {
        let id = req.params.id;
        const [rows] = await db.getOrderById(id);
        if (rows) {
            return res.status(200).send(rows);
        }
        return res.status(404).send(`Pedido ${id} não encontrado!`);
    } catch (err) {
        return res.status(err.code).json(err);
    }
});

app.get('/ordersByClientId/:id', async (req, res) => {

    try {
        let id = req.params.id;
        const [rows] = await db.getOrderByClientId(id);
        if (rows) {
            return res.status(200).send(rows);
        }
        return res.status(404).send(`Pedido ${id} não encontrado!`);
    } catch (err) {
        return res.status(err.code).json(err);
    }
});


app.put('/orders/:id', async (req, res) => {

    try {
        let id = req.params.id;

        let clientId = req.body.client_id;
        let productId = req.body.product_id
        let amount = req.body.amount

        const rows = await db.updateOrderById(id, clientId, productId, amount);
        if (rows) {
            return res.status(200).send({message: "Pedido atualizado com sucesso!"});
        }
        return res.status(404).send(`Pedido ${id} não encontrado!`);
    } catch (err) {
        return res.status(err.code).json(err);
    }
});

app.delete('/orders/:id', async (req, res) => {

    try {
        let id = req.params.id;
        await db.deleteOrderById(id);
        return res.status(200).send({message: `Pedido ${id} deletado com sucesso!`});

    } catch (err) {
        return res.status(err.code).json(err);
    }
});


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
