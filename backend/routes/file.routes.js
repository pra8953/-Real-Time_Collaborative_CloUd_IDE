const fileRouter = require('express').Router();
const { addfile, getFiles, updateFile, deletefile } = require('./../controllers/file.controller');
const verifyToken = require('./../middlewares/verifyToken');

fileRouter.post('/add-file',verifyToken,addfile)


fileRouter.get('/get-files/:id',verifyToken,getFiles);

fileRouter.put('/updated-file/:id',verifyToken,updateFile);
fileRouter.delete('/delete-file/:id',verifyToken,deletefile);



module.exports = fileRouter;