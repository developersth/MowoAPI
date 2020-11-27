const express = require('express');
const router = express.Router();
const machinController = require('../controllers/machine.controler');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/machine')
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' +
        file.originalname.split('.')[file.originalname.split('.').length-1])}
})
const fileFilter=(req,file,cb)=>{
    if (file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};
const upload = multer({ storage: storage,limits:{fieldSize:1024*1024*5},fileFilter:fileFilter});
router.post('/',upload.single('images'), machinController.create);
router.get('/', machinController.findAll);
router.get('/:id', machinController.findOne);
router.delete('/:id', machinController.delete);
module.exports = router;