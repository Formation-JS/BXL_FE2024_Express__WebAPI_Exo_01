import { DataTypes, Sequelize } from "sequelize";


/** @param {Sequelize} sequelize */
export default function genreModel(sequelize) {

    const Genre = sequelize.define('genre', {
        name : {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: 'uk_genre__name'
        }
    }, {
        tableName: 'genre',
        timestamps: false
    });

    return Genre;
};