const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator');
const Web3 = require("web3");

let web3 = null;
let contract = null;
let accounts = null;
class Items {
    constructor() {
        this.owner = [];
        this.id = [];
        this.price = [];
    }
    
    newItem(_owner, _id, _price) {
        this.owner.push(_owner);
        this.id.push(_id);
        this.price.push(_price);
    }

    getItem(_id) {
        return {owner: this.owner[_id], id: this.id[_id], price: this.price[_id]};
    }
};

let item = new Items();

async function connect(provider, contractPath) {
    web3 = new Web3(provider);
    var _contract = require(contractPath);
    const id = await web3.eth.net.getId();
    const deployNetwork = _contract.networks[id];
    contract = new web3.eth.Contract(
        _contract.abi,
        deployNetwork.address
    );
    accounts = await web3.eth.getAccounts();
}

async function getData() {
    var allItem = await contract.methods.getAllStuff().call();
    item = new Items();
    for(var i =0; i < allItem; i++) {
        var event = await contract.getPastEvents(
            "eventStuff",
            {
                filter: {
                    id: i
                },
                fromBlock: 0,
                toBlock: 'latest'
            }
        );
        item.newItem(event[0].returnValues.owner,
            event[0].returnValues.id,
            event[0].returnValues.price);
    }
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
    const queryData = async () => {
        await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
        await getData();
        res.render("market", {owner: item.owner, price: item.price, id: item.id});
    }
    queryData();
});

app.get('/item', (req, res) => {
    var id = req.query.id;
    const queryData = async () => {
        await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
        res.render("item-form", {owner: item.owner[id], price: item.price[id], id: item.id[id]});
    }
    console.log(item.id[id]);
    queryData();
});

app.get('/add', (req, res) => {
    res.render("add", { errors: null});
});

app.post('/add', [
    check("itemName", "Please enter a item name").not().isEmpty(),
    check("price", "Please enter a item price").not().isEmpty(),
], (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.render("add", { errors: err.errors });
    }
    else {
        const addData = async () => {
            await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
            var allItem = await contract.methods.getAllStuff().call();
            await contract.methods.registedNewStuff(Number(allItem), req.body.price).send({
                from: accounts[2],
            });
            await getData();
            res.render("market", {owner: item.owner, price: item.price, id: item.id});
        }
        addData();
    }
});