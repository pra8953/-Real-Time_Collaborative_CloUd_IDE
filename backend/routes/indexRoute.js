const router = require('express').Router();
const userRoute = require('./userRoutes')
router.use('/auth',userRoute);


module.exports = router;