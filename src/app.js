import express from 'express';
import morgan from 'morgan';

//! Variable d'environnement
const { NODE_ENV, PORT } = process.env;

//! Configuration de la Web API
const app = express();

//! App Middlware
app.use(morgan('tiny'));

//TODO Routing

//! Démarrage de la Web API
app.listen(PORT, (error) => {

    if (error) {
        console.log('Web API on error ! \n');
        console.log(error);
        return;
    }

    console.log(`Web API is running on port ${PORT} [ENV: ${NODE_ENV}]`);
});
