const generateFileName =(file)=> {
    // Get the file extension
    let extension = file.name.split('.').pop();
    
    // Determine the file type
    let fileType;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      fileType = 'Photo';
    } else if (['mp4', 'avi', 'mov'].includes(extension)) {
      fileType = 'Video';
    } else {
      fileType = 'Docs';
    }
    
    // Generate a random number
    // Generate a large random number
let randomNumber = Math.floor(Math.random() * 100000);

// Get the current date
let currentDate = new Date();

// Combine the random number and the date
let output = `${randomNumber}_${currentDate.toISOString().replace(/:/g, "").replace(/\..+/, "").replace(/T/, "_").replace(/-/g, "")}`;
    
    // Create the new filename
    let newFileName = `${fileType}_${output}.${extension}`;
    
    return {
        name: newFileName,
        type: fileType,
    };
  }

export default generateFileName;