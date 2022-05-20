import express from 'express';
import bodyParser from 'body-parser';

import boardsRoutes from './routes/boards.js';

import sequelize from './db/boards.js';

sequelize.sync();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/boards', boardsRoutes);

app.listen(PORT, () => console.log(`Server Running on PORT: http://localhost:${PORT}`));