import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { isCloudinaryConfigured, uploadToCloudinary } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        const normalizedPhoneNumber = phoneNumber?.toString().trim();
         
        if (!fullname || !email || !normalizedPhoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        if (!/^\d{10,15}$/.test(normalizedPhoneNumber)) {
            return res.status(400).json({
                message: "Phone number must contain 10 to 15 digits only.",
                success: false
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let profilePhoto = "";

        if (req.file) {
            if (!isCloudinaryConfigured) {
                return res.status(500).json({
                    message: "Cloudinary is not configured. Add your Cloudinary keys in backend/.env.",
                    success: false,
                });
            }
            const fileUri = getDataUri(req.file);
            const cloudResponse = await uploadToCloudinary(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        await User.create({
            fullname,
            email,
            phoneNumber: normalizedPhoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Unable to create account right now.",
            success: false,
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const normalizedPhoneNumber = phoneNumber?.toString().trim();
        const file = req.file;
        let cloudResponse = null;

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if (normalizedPhoneNumber) {
            if (!/^\d{10,15}$/.test(normalizedPhoneNumber)) {
                return res.status(400).json({
                    message: "Phone number must contain 10 to 15 digits only.",
                    success: false
                });
            }
            user.phoneNumber = normalizedPhoneNumber
        }
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        if (file) {
            if (!isCloudinaryConfigured) {
                return res.status(500).json({
                    message: "Cloudinary is not configured. Add your Cloudinary keys in backend/.env.",
                    success: false
                });
            }
            const fileUri = getDataUri(file);
            cloudResponse = await uploadToCloudinary(fileUri.content);
        }

        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Unable to update profile right now.",
            success: false
        });
    }
}
