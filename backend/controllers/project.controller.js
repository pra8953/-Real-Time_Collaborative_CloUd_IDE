const projectModel = require("../models/projectModel");
const userModel = require("../models/userModel");

async function addProject(req, res) {
  try {
    const { name, description } = req.body;
    const owner = req.Id; // token se aaya

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

module.exports = { addProject, getProjects, getProject, updateProject };
