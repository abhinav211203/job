import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;
export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });
}

export const uploadToCloudinary = async (fileUriContent) => {
    try {
        return await cloudinary.uploader.upload(fileUriContent);
    } catch (error) {
        if (error?.message?.includes("Invalid cloud_name")) {
            throw new Error("Invalid Cloudinary cloud name. Check CLOUDINARY_CLOUD_NAME in backend/.env.");
        }
        if (error?.message?.includes("Must supply api_key")) {
            throw new Error("Cloudinary API key is missing. Check your Cloudinary keys in backend/.env.");
        }
        throw error;
    }
};

export default cloudinary;
