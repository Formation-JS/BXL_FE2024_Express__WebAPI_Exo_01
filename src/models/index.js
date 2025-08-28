import { Sequelize } from "sequelize";
import gameModel from "./game.model.js";
import gameModeModel from "./gameMode.model.js";
import genreModel from "./genre.model.js";

//! Variable d'environnement
const { DB_DATABASE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;

//! Configuration de l'instance de la base de donnée
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres'
});

//! Objet « db » pour manipuler les éléments de la DB
const db = {};
db.sequelize = sequelize;

export default db;

//! Configuration des models de la DB
//? - Tables
db.Game = gameModel(sequelize);
db.Genre = genreModel(sequelize);
db.Mode = gameModeModel(sequelize);

//? - Relations
// Game + Genre
db.Game.belongsToMany(db.Genre, { through: 'game_genre' });
db.Genre.belongsToMany(db.Game, { through: 'game_genre' });

// Game + Mode
db.Game.belongsToMany(db.Mode, { through: 'game_mode' });
db.Mode.belongsToMany(db.Game, { through: 'game_mode' });