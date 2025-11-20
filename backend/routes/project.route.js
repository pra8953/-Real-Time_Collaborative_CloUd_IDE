const projectRouter = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  addProject,
  getProjects,
  getProject,
  updateProject,
  generateInviteLink,
  acceptInvite,
} = require("../controllers/project.controller");

projectRouter.post("/add-project", verifyToken, addProject);
projectRouter.get("/get-projects", verifyToken, getProjects);
projectRouter.get("/get-project/:id", verifyToken, getProject);
projectRouter.put("/update-project/:id", verifyToken, updateProject);
projectRouter.post(
  "/generate-invite-link/:projectId",
  verifyToken,
  generateInviteLink
);
projectRouter.post(
  "/accept-invite/:projectId/:token",
  verifyToken,
  acceptInvite
);

module.exports = projectRouter;
