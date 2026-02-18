import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadMedia = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    console.log("error in uploading media to cloudinary");
    console.log(error);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.log("error in deleting media from cloudinary");
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return response;
  } catch (error) {
    console.log("error in deleting video from cloudinary");
    console.log(error);
  }
};
