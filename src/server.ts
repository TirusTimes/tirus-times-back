// import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import router from './routes/index';

dotenv.config();

const PORT = process.env.PORT ?? 3333;

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
});
// app.use(cors());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server Running PORT: ${PORT}`);
});
export { app };
