import multer from "multer";
import path from "path";
import fs from "fs";
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(!fs.existsSync("./public")){
            fs.mkdirSync("./public");
        }
        
        cb(null,"./public");
        
    },
    filename:(req,file,cb)=>{
        const uniqueName = Date.now()+"-"+file.originalname.replace(/\s+/g,"_");
        cb(null,uniqueName)
    }

})
export const upload = multer({
    storage,
    limits:{fileSize:5*1024*1024},//5mb limit

});