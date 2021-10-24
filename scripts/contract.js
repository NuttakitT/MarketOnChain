const Web3 = require("Web3")
const _cotract = require("../build/contracts/Market.json")

const init = async () => {

    const provider = "HTTP://127.0.0.1:7545"
    const web3 = new Web3(provider)

    const id = await web3.eth.net.getId()
    const deployNetwork = _cotract.networks[id]
    const contract = new web3.eth.Contract(
        _cotract.abi,
        deployNetwork.address
    )
}
init()