const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator');

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, () => {
    console.log('Start server at port 3000.');
});

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, '../templates/index.html'));
    res.render("index");
});

app.get('/market', (req, res) => {
    // res.sendFile(path.join(__dirname, '../templates/market.html'));
    res.render("market");
});

app.get('/item', (req, res) => {
    // res.sendFile(path.join(__dirname, '../templates/item-form.html'));
    res.render("item");
});

app.get('/add', (req, res) => {
    res.render("add");
    // res.sendFile(path.join(__dirname, '../templates/add.html'));
});

app.post('/add', [
    check("itemName", "Please enter a item name").not().isEmpty(),
    check("price", "Please enter a item price").not().isEmpty(),
], (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.sendFile(path.join(__dirname, '../templates/add.html'), { errors: err });
        console.log(err);
    }
});