const projectRouter = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  addProject,
  getProjects,
  getProject,
} = require("../controllers/project.controller");

projectRouter.post("/add-project", verifyToken, addProject);
projectRouter.get("/get-projects", verifyToken, getProjects);
projectRouter.get("/get-project/:id", verifyToken, getProject);

module.exports = projectRouter;
