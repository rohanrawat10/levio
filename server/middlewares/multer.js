import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public");
    },
    filename:(req,file,cb)=>{
        const uniqueName = Date.now()+"-"+file.originalname;
        cb(null,uniqueName)
    }

})
export const upload = multer({
    storage,
    limits:{fileSize:5*1024*1024},//5mb limit

});