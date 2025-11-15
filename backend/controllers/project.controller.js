const projectModel = require("../models/projectModel");
const userModel = require("../models/userModel");




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

module.exports = { addProject, getProjects, getProject };
