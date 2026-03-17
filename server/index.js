import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import sequelize from './config/database.js';
import router from './routes/index.js';
import { swaggerSpec } from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/static', express.static('static'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

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