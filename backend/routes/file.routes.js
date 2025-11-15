const fileRouter = require('express').Router();
const { addfile, getFiles } = require('./../controllers/file.controller');
const verifyToken = require('./../middlewares/verifyToken');

fileRouter.post('/add-file',verifyToken,addfile)


fileRouter.post('/get-files',verifyToken,getFiles);





module.exports = fileRouter;