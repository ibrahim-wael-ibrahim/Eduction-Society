const generateEmailAndPassword = (name, type, birthDay, nameInstitution) => {
  // Split the name into parts
  const nameParts = name.toLowerCase().split(" ");

  // Get the first part from the type and convert it to lowercase
  const typePart = type.split("_")[0].toLowerCase();

  // Get the first name from the institution name
  const institutionParts = nameInstitution.split(/[_ -]/);
  const firstNameInstitution = institutionParts[0].toLowerCase();

  // Generate a random number between 1000 and 9999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;

  // Generate the email address
  const email = `${nameParts[0]}.${nameParts[1] ? nameParts[1] : ""}${randomNumber}@${firstNameInstitution}.${typePart}.com`;

  // Generate the password from the birthDay
  const password = birthDay.replace(/-/g, '');
  // const password = "12345678";
  console.log("email",email)
  console.log("pass",password)

  // Return both email and password
  return { email, password };
};
  export default generateEmailAndPassword;