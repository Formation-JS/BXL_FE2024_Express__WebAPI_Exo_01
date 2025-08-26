import { Router } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import path from 'node:path';
import gameController from "../controllers/game.controller.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const gameRouter = Router();

gameRouter.route('/')
    .get(paginationMiddleware, gameController.getAll)
    .post(gameController.insert);

gameRouter.route('/:id')
    .get(gameController.getById)
    .put(gameController.update)
    .delete(gameController.delete);


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/cover/');
    },
    filename: (req, file, callback) => {
        const filename = nanoid()
        const ext = path.extname(file.originalname);
        callback(null, filename + ext);
    }
});
const uploadFile = multer({ storage });

gameRouter.route('/:id/cover')
    .patch(uploadFile.single('cover'), gameController.uploadCover);

export default gameRouter;