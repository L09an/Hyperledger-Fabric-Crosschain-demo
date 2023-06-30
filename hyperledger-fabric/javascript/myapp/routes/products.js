var express = require('express');
var router = express.Router();
const FabricClient = require('../fabric/client.js');
const client = new FabricClient();

router.get('/create', function(req, res, next) {
  var userRequest = new Promise((resolve, reject)=>{
    var users = client.listUsers();
    resolve(users);
  })

  var partTypes = ["engine", "window","wheel", "frame"]
  console.log(req.session.username)
  userRequest.then(users => {

    res.render('createProduct', {users: users, user:req.session.username, title:"Create New Product",partTypes:partTypes});
  })

})

// Task 5
/* GET products listing. */
router.get('/:productId', function(req, res, next) {
  var productRequest = new Promise((resolve, reject)=>{
    try {
      var product = client.query('admin', 'QueryProduct', [req.params.productId]);
      resolve(product);
    } catch(error){
      reject(error);
    }
  });

  var userRequest = new Promise((resolve, reject)=>{
    var users = client.listUsers();
    resolve(users);
  })

  Promise.all([productRequest, userRequest]).then((data) => {
    console.log("Give it back to the page.");
    console.log(data[0]);
    console.log(data[1]);
    res.render('product', {product: data[0], users: data[1]});
  })
});

// Task 6
router.post('/create', function(req, res, next) {
  var identity = req.body.identity;
  var Manufacturer = req.body.Manufacturer;
  var Serialnumber = req.body.Serialnumber;
  var Creationdate = req.body.Creationdate;
  var partType = req.body.partType;
  console.log(req.body);
  request = new Promise((resolve, reject) => {
    try{
      var product = client.invoke(identity, 'CreatePart', [Manufacturer, Serialnumber, partType, Creationdate, Manufacturer]);
      resolve(product);
    }catch(error){
      reject(error);
    }
  })
  request.then(product => {
    res.redirect('/');
  }, (error)=>{
    console.log("Error", error);
    res.render('error', {error:error});
  })
})

router.post('/:productId', function(req, res){
  var identity = req.body.identity;
    var request = new Promise((resolve, reject)=>{
      try{
        var product = client.invoke(identity, 'SignProduct', [req.params.productId]);
        resolve(product);
      }catch(error){
        reject(error);
      }
    })

    request.then(product=>{
      res.redirect(`/products/${req.params.productId}`)
    }, (error)=>{
      console.log("Error", error);
      res.render('error', {error:error});
    })
})

module.exports = router;
