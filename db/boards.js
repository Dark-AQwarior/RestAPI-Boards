import Sequelize from "sequelize";

const sequelize = new Sequelize('boards', 'user', 'pass', {
    dialect: 'sqlite',
    host: 'boards.sqlite3'
});

export default sequelize;
