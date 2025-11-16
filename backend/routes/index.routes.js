const router = require("express").Router();
const userRoute = require("./user.routes");
const googleAuthRoute = require("./googleAuth.routes");
const githubAuthRoutes = require("./githubAuth.routes");
const projectRouter = require('./project.route')
const fileRouter = require('./file.routes');
// authentications
router.use("/auth", userRoute);
router.use("/auth", googleAuthRoute);
router.use("/auth", githubAuthRoutes);



// projects
router.use('/project',projectRouter);


// file
router.use('/file',fileRouter);


module.exports = router;
