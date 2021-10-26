const Web3 = require("Web3");

let web3;
let contract;
let account;
async function connect(provider, buildContracr) {
    web3 = new Web3(provider);
    const _cotract = require(buildContracr);
    const id = await web3.eth.net.getId();
    const deployNetwork = _cotract.networks[id];
    contract = new web3.eth.Contract(
        _cotract.abi,
        deployNetwork.address
    );
    // await contract.methods.registedNewStuff(0, 5000).send({
    //     from: addresses[1],
    // });
    // await contract.methods.registedNewStuff(1, 1000).send({
    //     from: addresses[1],
    // });
    // await contract.methods.registedNewStuff(2, 3000).send({
    //     from: addresses[1],
    // });
    // await contract.methods.unregistedMyStuff(1, 1000).send({
    //     from: addresses[1],
    // });
    // const event = await contract.getPastEvents(
    //     "eventStuff",
    //     {
    //         filter: {
    //             id: 1
    //         }
    //     }
    // );
    // console.log(event[0].returnValues.price);
}

async function getAccount(index, provider, buildContract) {
    connect(provider, buildContract);
    var accounts = web3.eth.getAccounts();
    account = accounts[index];
} 