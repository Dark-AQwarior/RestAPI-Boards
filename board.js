import {Model, DataTypes} from 'sequelize';
import sequelize from './db/boards.js';

class Board extends Model {}

Board.init({
    state: {
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING
    }
},{
    sequelize,
    modelName: 'board',
    timestamps: false
})

export default Board;