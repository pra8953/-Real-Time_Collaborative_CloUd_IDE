const router = require("express").Router();
const userRoute = require("./user.routes");
const googleAuthRoute = require("./googleAuth.routes");
const githubAuthRoutes = require("./githubAuth.routes");
const projectRouter = require('./project.route')

// authentications
router.use("/auth", userRoute);
router.use("/auth", googleAuthRoute);
router.use("/auth", githubAuthRoutes);



// projects
router.use('/project',projectRouter);

module.exports = router;
