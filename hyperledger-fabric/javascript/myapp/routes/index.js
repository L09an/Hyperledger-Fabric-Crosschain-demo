var express = require('express');
var router = express.Router();
const FabricClient = require('../fabric/client.js');
const Login = require
const client = new FabricClient();
const Web3 = require('web3');
const app = require('../app.js');
const web3 = new Web3(Web3.givenProvider ||"ws://127.0.0.1:8545");

//Ethereum init
var accounts = web3.eth.getAccounts();

var pmabi =  [
    {
      "constant": true,
      "inputs": [],
      "name": "parts_cnt",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "products_cnt",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "products",
      "outputs": [
        {
          "name": "manufacturer",
          "type": "address"
        },
        {
          "name": "serial_number",
          "type": "string"
        },
        {
          "name": "product_type",
          "type": "string"
        },
        {
          "name": "creation_date",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "parts",
      "outputs": [
        {
          "name": "manufacturer",
          "type": "address"
        },
        {
          "name": "serial_number",
          "type": "string"
        },
        {
          "name": "part_type",
          "type": "string"
        },
        {
          "name": "creation_date",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "parts_list",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "products_list",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "part_hash",
          "type": "bytes32"
        }
      ],
      "name": "parthash",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "serial_number",
          "type": "string"
        },
        {
          "name": "part_type",
          "type": "string"
        },
        {
          "name": "creation_date",
          "type": "string"
        }
      ],
      "name": "buildPart",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "serial_number",
          "type": "string"
        },
        {
          "name": "product_type",
          "type": "string"
        },
        {
          "name": "creation_date",
          "type": "string"
        },
        {
          "name": "part_array",
          "type": "bytes32[6]"
        }
      ],
      "name": "buildProduct",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "product_hash",
          "type": "bytes32"
        }
      ],
      "name": "getParts",
      "outputs": [
        {
          "name": "",
          "type": "bytes32[6]"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "parthasha",
          "type": "bytes32"
        }
      ],
      "name": "getPart",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

var pmaddress = '0x8554576b51D271326BA7C8831D3Cc115baCDB2C0';


pm = new web3.eth.Contract(pmabi, pmaddress);

var ethParts = []

async function getContractPublicVariable() {
    while(ethParts.length > 0) {
        ethParts.pop();
    }
    var cnt = []
    for(i=0;i<5;i++){
        pm.methods.parts_list(i).call().then((value) =>{
            console.log(value)
            cnt.push(value)
            ethParts.push(value)
        //     pm.methods.parts(value).call().then((result) =>{
        //         ethParts.push(result)
        //         console.log(result)
        // })
        })
        
    }
    console.log(cnt)
}

getContractPublicVariable()

// setTimeout(getParts(),6000)
/* GET home page. */
// Task 5
router.get('/', function(req, res, next) {
  if(!req.session.username){
    console.log("not login yet !");
    res.render('login',{title:'Login'});
  }else {
    var accounts =[]
    web3.eth.getAccounts().then((result) => {
      accounts = result;
      // console.log("Latest Ethereum Block is ",accounts);
      });

  var productRequest = new Promise((resolve, reject) => {
    if (req.query.search){
      console.log(req.query.search)
      var products = client.invoke('admin', 'Searchpart',req.query.search);
    }
    //  else if (req.query.filter){
    //   // TAsk 8
    //   var products = client.query('admin', 'GetIncompleteProducts');
    // } 
    else{
      var products = client.invoke('admin', 'Searchpart','factory1');
    }
    
    resolve(products);
  });
  var userRequest = new Promise((resolve, reject)=>{
    var users = client.listUsers();
    resolve(users);
  })

  if(req.session.ethParts){
    var eth  = req.session.ethParts
    // console.log(eth)
  for(i=0;i<2;i++){
     pm.methods.parts(eth[i]).call().then((result) =>{
            // ethParts.push(result)
            console.log(result)
        })
  }
  }


  Promise.all([productRequest, userRequest]).then((data) => {
    req.session.ethParts = ethParts
    console.log("resolved");
    console.log("outside loop, parts is");
    const products = JSON.parse(data[0])
    console.log(ethParts)
    res.render('index', { title: 'Warehouse', products: products, users: data[1], user: req.session.username, 
    filter: req.query.filter, search: req.query.search, accounts:accounts, ethParts: ethParts, ethAccount: accounts[0] });
  })
  }

});

router.post('/', function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  if(password =='root'){
    req.session.username = username
    console.log(req.session.username)
    res.redirect('/')
  }else{
    res.render('login',{title:'Login', loginError:"Incorrect username or password!"})
  }
  console.log(username)

})

var pm = new web3.eth.Contract([
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "products",
        "outputs": [
            {
                "name": "manufacturer",
                "type": "address"
            },
            {
                "name": "serial_number",
                "type": "string"
            },
            {
                "name": "product_type",
                "type": "string"
            },
            {
                "name": "creation_date",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x79054391"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "parts",
        "outputs": [
            {
                "name": "manufacturer",
                "type": "address"
            },
            {
                "name": "serial_number",
                "type": "string"
            },
            {
                "name": "part_type",
                "type": "string"
            },
            {
                "name": "creation_date",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x8c431b9f"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor",
        "signature": "constructor"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "serial_number",
                "type": "string"
            },
            {
                "name": "part_type",
                "type": "string"
            },
            {
                "name": "creation_date",
                "type": "string"
            }
        ],
        "name": "buildPart",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xb9c2dc3a"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "serial_number",
                "type": "string"
            },
            {
                "name": "product_type",
                "type": "string"
            },
            {
                "name": "creation_date",
                "type": "string"
            },
            {
                "name": "part_array",
                "type": "bytes32[6]"
            }
        ],
        "name": "buildProduct",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xd2af2aec"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "product_hash",
                "type": "bytes32"
            }
        ],
        "name": "getParts",
        "outputs": [
            {
                "name": "",
                "type": "bytes32[6]"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x6e730329"
    }
])

 pm.options.address = '0x1c898ed5eF7EF0325D3e22Ee4c308c21163B070A'

 // web3.eth.sendTransaction({from :'0x1c898ed5eF7EF0325D3e22Ee4c308c21163B070A', to: '0x880dB1AD5F082F5F9B87E5225d6d926C23664eB7', value:'10000000000000000000'}).then(function(receipt){
 //   console.log(receipt)
 // })

pm.methods.buildPart('1214','wheel','12/12/22').send({from: '0x682Fdc54FF32579BA1498FF970002a710749Be5F',gas:1000000}, function(error, result){
  console.log('sent!');
  console.log(result)
 })


module.exports = router;
