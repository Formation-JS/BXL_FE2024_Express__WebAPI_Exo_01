import { DataTypes, Sequelize } from "sequelize";


/** @param {Sequelize} sequelize */
export default function gameModeModel(sequelize) {

 const Mode = sequelize.define('mode', {
        name : {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: 'uk_mode__name'
        }
    }, {
        tableName: 'mode',
        timestamps: false
    });

    return Mode;
};