require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploader = async (file) => {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "image",
    }, (err, res) => {
        if (err) throw new Error(err);
    });
    
    return res.secure_url;
}

const uploadHandler = async (file) => {
    try {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const imageURL = await uploader(dataURI);
        return imageURL;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = uploadHandler;