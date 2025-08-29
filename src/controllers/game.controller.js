import games from './../data/game.json' with { type: 'json' };
import fs from 'node:fs/promises';
let lastId = Math.max(...games.map(g => g.id));

function gameIsValid(data) {

    // Champs texte
    if (!data.name?.trim() || !data.shortDesc?.trim() || !data.releaseDate?.trim()) {
        return false;
    }

    // Genres
    if (!Array.isArray(data.genres) || data.genres.length < 1) {
        return false;
    }

    // Mode
    const rulesRegex = /^(?!solo$)(?!multi$).+/i;

    if (!Array.isArray(data.mode) || data.mode.length < 1 || data.mode.some(m => rulesRegex.test(m))) {
        return false;
    }

    // Objet validé !
    return true;
}

const gameMapper = {
    toCompleteDTO : (game) => ({
        id: game.id,
        name: game.name,
        desc: game.desc,
        shortDesc: game.shortDesc,
        releaseDate: game.releaseDate.toISOString(),
        cover: game.cover,
        genres: game.genres?.map(g => g.name),
        mode: game.mode?.map(m => m.name),
    }),

    toShortDTO : (game) => ({
        id: game.id,
        name: game.name,
        shortDesc: game.shortDesc,
    })
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
            .map(g => ({ id: g.id, name: g.name, shortDesc: g.shortDesc }));

        res.status(200).json(result);
    },

    insert: (req, res) => {
        // Validation des données
        if (!gameIsValid(req.body)) {
            res.sendStatus(422);
            return;
        }

        // Vérification de doublon
        if (gameAllReadyExists(req.body)) {
            res.status(409).json({ error: 'Le jeu exists déjà !' });
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
        if (!gameIsValid(req.body)) {
            res.sendStatus(422);
            return;
        }

        // Recherche du jeu
        const gameIndex = games.findIndex(g => g.id === id);
        if (gameIndex < 0) {
            res.sendStatus(404);
            return;
        }

        // Vérification de doublon
        const originalGameName = games[gameIndex].name;
        const originalGameReleaseDate = games[gameIndex].releaseDate;

        if ((originalGameName !== req.body.name  || originalGameReleaseDate !== req.body.releaseDate)  && gameAllReadyExists(req.body)) {
            res.status(409).json({ error: 'Le jeu exists déjà !' });
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
        if (gameIndex < 0) {
            res.sendStatus(404);
            return;
        }

        games.splice(gameIndex, 1);
        res.sendStatus(204);
    },

    uploadCover: async (req, res) => {
        // Récuperation des informations de la requete
        const id = parseInt(req.params.id);
        const cover = req.file;

        await (new Promise(resolve => setTimeout(resolve, 2000)));

        // Rechercher le jeu
        const gameIndex = games.findIndex(g => g.id === id);
        if (gameIndex < 0) {
            await fs.unlink(req.file.path);
            res.sendStatus(404);
            return;
        }

        // Mise à jour de la cover du jeu
        games[gameIndex].cover = cover.path;

        // Cloture de la requete
        res.sendStatus(204);
    }
};

export default gameController;