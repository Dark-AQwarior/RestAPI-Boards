// Import all the modules required
import {Model, DataTypes} from 'sequelize';
import sequelize from './db/boards.js';

// Initializing a User model to further create a users table in the database.
class User extends Model {}

// Defining the structure of the users table.
User.init({
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
},{
    sequelize,
    modelName: 'user',
    timestamps: false // ignoring the issued at and expires at timestamps in the database.
})

export default User;