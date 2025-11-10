const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./../../models/userModel');


const signup = async(req,res)=>{
    try{
        const {name, email,password,} = req.body
        const userExists = await userModel.findOne({email});
        if(userExists){
            return res.status(409).json({
                success:false,
                message:"User alredy exits! please login"
            })

        
        }
        const hassPass = await bcrypt.hash(password,13);
        const newUser = new userModel({
            name,
            email,
            password:hassPass
        });
         await newUser.save();
        const token =  jwt.sign(
          {  id: newUser._id},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            success:true,
            message:"User Register successfully!",
            token
        })

    }catch(err){

        res.status(500).json({
            success:false,
            message:"Internal server error 2"
        })
    }
}



const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const userExists = await userModel.findOne({email});
        if(!userExists){
            return res.status(403).json({
                success:false,
                message:"Unauthorize access!"
            })
        }

        const checkPass = await bcrypt.compare(password,userExists.password);
        if(!checkPass){
            return res.status(401).json({
                success:false,
                message:"incorrect password"
            })
        }

        const token = jwt.sign(
           {id: userExists._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )
        res.status(200).json({
            success:true,
            message:"login successfully!",
            token
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: err.message
        })

    }
}




module.exports ={
    signup,
    login
}