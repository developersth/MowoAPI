var express = require('express');
var router = express.Router();
const app = express();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/get-all-routes", (req, res) => {  
  res.send({ get: "fgfgf", post: "ghg" });
});

module.exports = router;
