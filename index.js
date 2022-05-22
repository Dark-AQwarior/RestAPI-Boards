// Import all the modules required
import express from 'express';
import bodyParser from 'body-parser';
import boardsRoutes from './routes/boards.js';
import sequelize from './db/boards.js';

// Sequelize will automatically perform an SQL query to the database. To automatically synchronize all models. 
sequelize.sync();

//Express server along with browser-sync
const app = express({sync:true});
const PORT = 5000;

// This project uses json object for the actions performing.
app.use(bodyParser.json());

// Setting routes to use the restAPI using them in URL's.
app.use('/boards', boardsRoutes);

// Initializing http port to listen for the request and response cycles.
app.listen(PORT, () => console.log(`Server Running on PORT: http://localhost:${PORT}`));