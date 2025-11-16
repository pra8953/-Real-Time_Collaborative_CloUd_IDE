const fileModel = require('./../models/fileModel');
const projectModel = require('./../models/projectModel');



async function addfile(req, res) {
    try {
        const { name, content, language, project } = req.body;

        if (!name) {
            return res.status(400).json({ error: "File name is required" });
        }

        if (!project) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        // Duplicate name check
        const existingFile = await fileModel.findOne({
            name,
            projectId: project
        });

        if (existingFile) {
            return res.status(409).json({
                success: false,
                message: "File already exists in this project",
            });
        }

        const file = new fileModel({
            name,
            content,
            language,
            projectId: project,
            version: 1
        });

        const savedFile = await file.save();

        await projectModel.findByIdAndUpdate(project, {
            $push: { files: savedFile._id },
        });

        return res.status(201).json({
            success: true,
            message: `${name} file created successfully!`,
            file:savedFile
        });
    } catch (err) {
        console.error("Error creating file:", err);
        res.status(500).json({ error: err.message });
    }
}

async function getFiles(req,res){
    const projectId = req.params.id; 
    try{
        const files = await fileModel.find({projectId});
        return res.status(200).json({
            success:true,
            data:files
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

async function updateFile(req,res){
    try{
        const file = await fileModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(200).json({
            success:true,
            message:"File updated successfully!"
        })

    }catch(err){
         res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


async function deletefile(req,res){
    try{

        const file = await fileModel.findByIdAndDelete(req.params.id);

                
        await projectModel.findByIdAndUpdate(file.projectId, {
            $pull: { files: file._id }
        });

        return res.status(200).json({
            success:true,
            message:"File deleted successfully!"
        })
        

    }catch(err){
            res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


module.exports ={addfile,getFiles,updateFile,deletefile};