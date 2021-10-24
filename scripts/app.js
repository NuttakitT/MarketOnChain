const express = require('express')
const path = require('path');
const app = express()
const router = express.Router();

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})

app.get('/', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, '../templates/index.html'))
})

app.get('/market', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, '../templates/market.html'))
})

// var allItem = 3;
// for (let index = 0; index < allItem; index++) {
//     app.get('/item' + index, (req, res) => {
//         res.status(200)
//         res.sendFile(path.join(__dirname, '../templates/item-form.html'))
//     })
// }

app.get('/item', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, '../templates/item-form.html'))
})

app.post('/item', (req, res) => {

})