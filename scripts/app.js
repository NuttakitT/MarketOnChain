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
        this.onSell = []
    }
    
    newItem(_owner, _id, _price, _onSell) {
        this.owner.push(_owner);
        this.id.push(_id);
        this.price.push(_price);
        this.onSell.push(_onSell);
    }

    getItem(_id) {
        return {owner: this.owner[_id], id: this.id[_id], price: this.price[_id], onSell: this.onSell[_id]};
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
    for(var i =1; i <= allItem; i++) {
        var event = await contract.getPastEvents(
            "eventStuff",
            {
                filter: {
                    id: i,
                },
                fromBlock: 0,
                toBlock: 'latest'
            }
        );
        if(event[event.length-1].returnValues.sell != false) {
            item.newItem(event[event.length-1].returnValues.owner,
                event[event.length-1].returnValues.id,
                event[event.length-1].returnValues.price,
                event[event.length-1].returnValues.sell);
        }
    }
    // console.log(item);
}

async function getDataByAddress(address) {
    item = new Items();
    var event = await contract.getPastEvents(
        "eventStuff",
        {
            filter: {
                owner: address,
            },
            fromBlock: 0,
            toBlock: 'latest'
        }
    );
    for(var i = 0; i < event.length; i++) {
        item.newItem(event[i].returnValues.owner,
            event[i].returnValues.id,
            event[i].returnValues.price,
            event[i].returnValues.sell);
    }
}

async function getSingleData(index) {
    item = new Items();
    var event = await contract.getPastEvents(
        "eventStuff",
        {
            filter: {
                id: index
            },
            fromBlock: 0,
            toBlock: 'latest'
        }
    );
    item.newItem(event[event.length-1].returnValues.owner,
        event[event.length-1].returnValues.id,
        event[event.length-1].returnValues.price,
        event[event.length-1].returnValues.sell);
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

app.get('/market', async (req, res) => {
    await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
    await getData();
    res.render("market", {owner: item.owner, price: item.price, id: item.id});
});

app.get('/item', async (req, res) => {
    var id = req.query.id;
    await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
    await getSingleData(id);
    res.render("item-form", {owner: item.owner[0], price: item.price[0], id: item.id[0]});
});

app.post('/item/changeOwner', async (req, res) => {
    const owner = req.body.owner;
    const bidPrice = req.body.price;
    const lastPrice  = req.body.lastPrice;
    const id = req.body.id;
    
    await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
    var balance = await web3.eth.getBalance(accounts[4]);
    balance = await web3.utils.fromWei(balance, 'ether');
    // console.log(owner);
    // console.log(bidPrice);
    // console.log(lastPrice);
    // console.log(id);
    // console.log(balance);
    if(Number(bidPrice) > Number(balance) || Number(bidPrice) <= Number(lastPrice)) {
        await getData();
        res.render("market", {owner: item.owner, price: item.price, id: item.id});
    }
    else {
        await contract.methods.buyStuff(id, bidPrice).send({
            from: accounts[4],
            to: owner,
            value: web3.utils.toWei(bidPrice, 'ether'),
        });
        await getData();
        res.render("market", {owner: item.owner, price: item.price, id: item.id});
    }
});

app.get('/add', (req, res) => {
    res.render("add", { errors: null});
});

app.post('/add', [
    check("itemName", "Please enter a item name").not().isEmpty(),
    check("price", "Please enter a item price").not().isEmpty(),
], async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.render("add", { errors: err.errors });
    }
    else {
        await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
        var allItem = await contract.methods.getAllStuff().call();
        await contract.methods.registedNewStuff(Number(allItem)+Number(1), req.body.price).send({
            from: accounts[2],
        });
        await getData();
        res.render("market", {owner: item.owner, price: item.price, id: item.id});
    }
});

app.get('/storage', async (req, res) => {
    await connect("HTTP://127.0.0.1:7545", "../build/contracts/Market.json");
    await getDataByAddress(accounts[4]);
    res.render("storage", {id: item.id, price: item.price, sell: item.onSell}); 
});