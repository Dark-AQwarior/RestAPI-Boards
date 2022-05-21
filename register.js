import {Model, DataTypes} from 'sequelize';
import sequelize from './db/boards.js';

class User extends Model {}

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
    timestamps: false
})

export default User;