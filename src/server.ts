import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import router from './routes/index';

dotenv.config();

const PORT = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server Running PORT: ${PORT}`);
});
export { app };
