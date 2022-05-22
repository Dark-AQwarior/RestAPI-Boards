import Sequelize from "sequelize";

// Initializing a database file with table-name and fields.
const sequelize = new Sequelize('boards', 'email', 'pass', {
    dialect: 'sqlite',
    host: 'boards.sqlite3'
});

export default sequelize;
