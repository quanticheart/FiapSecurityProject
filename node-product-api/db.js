const {randomUUID} = require('crypto');

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'finalProject',
        multipleStatements: true
    });
    global.connection = connection;
    return connection;
}

async function getAllProducts() {
    const conn = await connect();
    const query = `SELECT *
                   FROM products
                   LIMIT 1000;`;
    const [rows] = await conn.execute(query);
    return rows;
}

async function getProductById(id) {
    const conn = await connect();
    const query = `SELECT *
                   FROM products
                   WHERE id = ?;`;
    const [rows] = await conn.execute(query, [id]);
    return rows;
}


async function updateProductById(id, name, description, value) {
    try {
        const conn = await connect();
        const query = `UPDATE products
                       SET name        = ?,
                           description = ?,
                           value       = ?
                       WHERE id = ?;`;
        const [rows] = await conn.execute(query, [name, description, value, id]);
        return rows;
    } catch (err) {
        throw {code: 500, message: 'Erro inesperado ao tentar cadastrar produto'};
    }
}

async function deleteProductById(id) {
    const conn = await connect();
    const query = `DELETE
                   FROM products
                   WHERE id = ?;`;
    await conn.execute(query, [id]);
}

async function insertProduct(name, description, value) {
    const conn = await connect();
    const query = `INSERT INTO products(id, name, description, value)
                   VALUES (?, ?, ?, ?);`;
    try {
        await conn.execute(query, [randomUUID(), name, description, value]);
    } catch (err) {
        if (err.errno === 1062) {
            throw {code: 400, message: 'Já existe um produto cadastrado!'};
        } else {
            throw {code: 500, message: 'Erro inesperado ao tentar cadastrar usuário'};
        }
    }
}

module.exports = {getProductById, getAllProducts, insertProduct, updateProductById, deleteProductById}
