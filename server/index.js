import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database.js';
import { User } from './models/user.js';
import { Offer } from './models/offer.js';
import { Review } from './models/review.js';
import router from './routes/index.js';
import errorHandlingMiddleware from './middleware/ErrorHandlingMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/static', express.static('static'));
app.use('/', router);
app.use(errorHandlingMiddleware);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

start();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
