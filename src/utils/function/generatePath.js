import path from "path";
import fs from "fs";

const generatePath =(name, pathFolder  )=>{
    const uploadPath = path.join(process.cwd(), 'public/upload/'+ (pathFolder ? `${pathFolder}/` : "") + name);

    // Check if the folder exists, if not, create it
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    // Replace backslashes with forward slashes
    let savePath = uploadPath.replace(/\\/g, '/');

    // Remove the leading part of the path
    savePath = savePath.substring(savePath.indexOf('/upload'));

    return {
      savePath,
      uploadPath
    };
}

export default generatePath
