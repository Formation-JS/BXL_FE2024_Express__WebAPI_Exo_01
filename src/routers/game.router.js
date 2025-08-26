import { Router } from "express";
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

export default gameRouter;