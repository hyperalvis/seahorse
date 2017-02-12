import Web3 from 'web3'
import { Uport } from 'uport-lib'

let web3 = new Web3()
let options = {
  ipfsProvider: {
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
    root: ''
  }
}
let uport = new Uport('TestApp', options)
let uportProvider = uport.getUportProvider('https://ropsten.infura.io:8545')
web3.setProvider(uportProvider)

export { web3 }
