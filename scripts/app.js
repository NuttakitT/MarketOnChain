const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator');
const Web3 = require("Web3");

let web3 = null;
let contract = null;
let accounts = null;
async function init(provider, contractPath) {
    web3 = new Web3(provider);
    var _contract = require(contractPath);
    const id = await web3.eth.net.getId();
    const deployNetwork = _contract.networks[id];
    contract = new web3.eth.Contract(
        _contract.abi,
        deployNetwork.address
    );
    accounts = web3.eth.getAccounts();
}

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, () => {
    console.log('Start server at port 3000.');
});

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/market', (req, res) => {
    res.render("market");
});

app.get('/item', (req, res) => {

    res.render("item-form");
});

app.get('/add', (req, res) => {
    res.render("add", { errors: null });
});

app.post('/add', [
    check("itemName", "Please enter a item name").not().isEmpty(),
    check("price", "Please enter a item price").not().isEmpty(),
], (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.render("add", { errors: err.errors });
        console.log("has an error");
    }
    else {
        console.log(req.body.itemName);
        console.log(req.body.price);
        const test = async () => {
            await init("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
        }
        test();
        res.render("market");
    }
});