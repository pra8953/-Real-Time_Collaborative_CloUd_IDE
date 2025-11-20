const projectModel = require("../models/projectModel");
const userModel = require("../models/userModel");
const crypto = require("crypto");

async function addProject(req, res) {
  try {
    const { name, description } = req.body;
    const owner = req.Id; // came from token

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const projectExists = await projectModel.findOne({ name, owner });

    if (projectExists) {
      return res.status(409).json({
        success: false,
        message: "Project name already exists",
      });
    }

    const newProject = new projectModel({
      owner,
      name,
      description,
    });

    const savedProject = await newProject.save();

    // Add project into user's project list
    await userModel.findByIdAndUpdate(owner, {
      $push: { projects: savedProject._id },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: savedProject,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getProjects(req, res) {
  try {
    const owner = req.Id;

    const projects = await projectModel
      .find({ owner })
      .populate("collaborators.userId", "name email");

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getProject(req, res) {
  try {
    const { id } = req.params;

    const project = await projectModel.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error(err);
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const owner = req.Id;

    // Check if project exists and user owns it
    const project = await projectModel.findOne({ _id: id, owner });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to edit",
      });
    }

    // Check if new name already exists (excluding current project)
    if (name && name !== project.name) {
      const nameExists = await projectModel.findOne({
        name,
        owner,
        _id: { $ne: id },
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Project name already exists",
        });
      }
    }

    // Update project
    const updatedProject = await projectModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function generateInviteLink(req, res) {
  try {
    const userId = req.Id;
    const { projectId } = req.params;
    const { permission } = req.body;

    if (!permission || !["view", "edit"].includes(permission)) {
      return res.status(400).json({
        success: false,
        message: "Permission must be either 'view' or 'edit'",
      });
    }

    // Check owner
    const project = await projectModel.findOne({
      _id: projectId,
      owner: userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you are not the owner",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token + permission
    project.inviteToken = token;
    project.invitePermission = permission; // <<---- NEW FIELD
    project.inviteTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await project.save();

    const inviteLink = `${process.env.FRONTEND_URL}/dashboard/project_ide/${projectId}?token=${token}`;

    return res.status(200).json({
      success: true,
      inviteLink,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function acceptInvite(req, res) {
  try {
    const userId = req.Id;
    const { projectId, token } = req.params;

    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.inviteToken !== token) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid invite link" });
    }

    if (project.inviteTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invite link expired" });
    }

    const already = project.collaborators.some(
      (c) => c.userId.toString() === userId
    );

    if (!already) {
      project.collaborators.push({
        userId,
        permission: project.invitePermission || "view",
      });

      await project.save();
    }

    return res.status(200).json({
      success: true,
      message: "Successfully joined project",
      projectId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  addProject,
  getProjects,
  getProject,
  updateProject,
  generateInviteLink,
  acceptInvite,
};
