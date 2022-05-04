import express, { Application } from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import trpcRouter from './router';

const app: Application = express();

const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log('⬅️ ', req.method, req.path, req.body ?? req.query);
  next();
});
app.use(
  '/cat',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext,
  })
);

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
