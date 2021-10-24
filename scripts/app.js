const express = require('express')
const path = require('path');
const app = express();

app.listen(3000, () => {
    console.log('Start server at port 3000.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/index.html'));
});

app.get('/market', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/market.html'));
});

app.get('/item', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/item-form.html'));
});