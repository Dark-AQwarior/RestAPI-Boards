import Sequelize from "sequelize";

const sequelize = new Sequelize('boards', 'email', 'pass', {
    dialect: 'sqlite',
    host: 'boards.sqlite3'
});

export default sequelize;
