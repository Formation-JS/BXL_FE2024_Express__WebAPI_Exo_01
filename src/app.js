import express from 'express';
import morgan from 'morgan';
import { apiRouter } from './routers/index.js';

//! Variable d'environnement
const { NODE_ENV, PORT } = process.env;

//! Configuration de la Web API
const app = express();

//! App Middlware
app.use(morgan('tiny'));
app.use(express.json());

//! Routing
app.use('/api', apiRouter);

//! Démarrage de la Web API
app.listen(PORT, (error) => {

    if (error) {
        console.log('Web API on error ! \n');
        console.log(error);
        return;
    }

    console.log(`Web API is running on port ${PORT} [ENV: ${NODE_ENV}]`);
});
