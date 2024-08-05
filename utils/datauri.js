// import DataUriParser from "datauri/parser.js"
// import path from "path"
// const getDataUri=(file)=>{

// // const parser= new DataUriParser() 
// const parser = new DataUriParser();
// mistake is originalName should be orginalname
// const extName=path.extname(file.originalName).toString()
// console.log(extName)
//  return parser.format(extName, file.buffer)
// //  return parser.format(extName, file.content)
// }
import DataUriParser from "datauri/parser.js";
import path from "path";
const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};



export default getDataUri