var express = require('express');
var router = express.Router();
const app = express();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('welcome to node js API');
});
router.get("/get-all-routes", (req, res) => {  
  res.send({ get: "fgfgf", post: "ghg" });
});

module.exports = router;
