import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import sequelize from './config/database.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', router); // ← ВАЖНО

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });

  } catch (e) {
    console.log(e);
  }
}

start();