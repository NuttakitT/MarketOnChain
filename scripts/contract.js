const Web3 = require("Web3");
const _cotract = require("../build/contracts/Market.json");

let web3;
let contract;
let result;
async function init() {
    const provider = "HTTP://127.0.0.1:7545";
    web3 = new Web3(provider);

    const id = await web3.eth.net.getId();
    const deployNetwork = _cotract.networks[id];
    contract = new web3.eth.Contract(
        _cotract.abi,
        deployNetwork.address
    );

    const addresses = await web3.eth.getAccounts();
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
    const event = await contract.getPastEvents(
        "eventStuff",
        {
            filter: {
                id: 1
            }
        }
    );
    console.log(event[0].returnValues.price);
}
init();