import { DataTypes, Sequelize } from "sequelize";


/** @param {Sequelize} sequelize */
export default function gameModel(sequelize) {

    const Game = sequelize.define('game', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING(4_000),
            allowNull: true
        },
        shortDesc: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        releaseDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        cover: {
            type: DataTypes.STRING(250),
            allowNull: true
        }
    }, {
        tableName: 'game',
        timestamps: true
    });

    return Game;
};