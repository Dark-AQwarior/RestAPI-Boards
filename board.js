// Import all the modules required
import {Model, DataTypes} from 'sequelize';
import sequelize from './db/boards.js';

// Initializing a Board model to further create a users table in the database.
class Board extends Model {}

// Defining the structure of the boards table.
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
    timestamps: false // ignoring the issued at and expires at timestamps in the database.
})

export default Board;