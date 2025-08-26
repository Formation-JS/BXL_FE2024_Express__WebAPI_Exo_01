import games from './../data/game.json' with { type: 'json' };
let lastId = Math.max(...games.map(g => g.id));

function gameIsValid(data) {

    // Champs texte
    if(!data.name?.trim() || !data.shortDesc?.trim() || !data.releaseDate?.trim()) {
        return false;
    }

    // Genres
    if(!Array.isArray(data.genres) || data.genres.length < 1) {
        return false;
    }

    // Mode
    const rulesRegex = /^(?!solo$)(?!multi$).+/i;

     if(!Array.isArray(data.mode) || data.mode.length < 1 || data.mode.some(m => rulesRegex.test(m))) {
        return false;
    }

    // Objet validé !
    return true;
} 


const gameController = {

    getById: (req, res) => {
        const id = parseInt(req.params.id);
        const game = games.find(g => g.id === id);

        if (!game) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(game);
    },

    getAll: (req, res) => {
        const { offset, limit } = req.pagination;

        const result = games.slice(offset, offset + limit)
                            .map(g => ({ id: g.id, name: g.name, shortDesc: g.shortDesc}));

        res.status(200).json(result);
    },

    insert: (req, res) => {
        // Validation des données
        if(!gameIsValid(req.body)) {
            res.sendStatus(422);
            return;
        }

        // Incrementation de FakeId
        lastId++;

        // Ajout des données
        const gameAdded = {
            ...req.body,
            id: lastId,
            cover: null
        };
        games.push(gameAdded);

        // Cloture de la requete
        res.status(201)
           .location(`/api/game/${gameAdded.id}`)
           .json(gameAdded);
    },

    update: (req, res) => {
        const id = parseInt(req.params.id);
                
        // Validation des données
        if(!gameIsValid(req.body)) {
            res.sendStatus(422);
            return;
        }

        // Recherche du jeu
        const gameIndex = games.findIndex(g => g.id === id);
        if(gameIndex < 0) {
            res.sendStatus(404);
            return;
        }

        // Mise à jours
        games[gameIndex].name = req.body.name;
        games[gameIndex].desc = req.body.desc;
        games[gameIndex].shortDesc = req.body.shortDesc;
        games[gameIndex].releaseDate = req.body.releaseDate;
        games[gameIndex].genres = req.body.genres;
        games[gameIndex].mode = req.body.mode;

        res.sendStatus(204);
    },

    delete: (req, res) => {
        const id = parseInt(req.params.id);

        const gameIndex = games.findIndex(g => g.id === id);
        if(gameIndex < 0) {
            res.sendStatus(404);
            return;
        }

        games.splice(gameIndex, 1);
        res.sendStatus(204);
    }
};

export default gameController;