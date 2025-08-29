import db from './../models/index.js';
import fs from 'node:fs/promises';

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
    const rulesRegex = /^(?!Solo$)(?!Multi$).+/i;

    if (!Array.isArray(data.modes) || data.modes.length < 1 || data.modes.some(m => rulesRegex.test(m))) {
        return false;
    }

    // Objet validé !
    return true;
}

async function gameAllReadyExists({ name, releaseDate }) {

    const gameExists = await db.Game.findOne({
        where: { name, releaseDate }
    });

    return gameExists !== null;
};

const gameMapper = {
    toCompleteDTO: (game) => ({
        id: game.id,
        name: game.name,
        desc: game.desc,
        shortDesc: game.shortDesc,
        releaseDate: new Date(game.releaseDate).toISOString(),
        cover: game.cover,
        genres: game.genres?.map(g => g.name),
        modes: game.modes?.map(m => m.name),
    }),

    toShortDTO: (game) => ({
        id: game.id,
        name: game.name,
        shortDesc: game.shortDesc,
    })
};

const gameController = {

    getById: async (req, res) => {
        const id = parseInt(req.params.id);
        const game = await db.Game.findByPk(id, {
            include: [db.Genre, db.Mode]
        });

        if (!game) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(gameMapper.toCompleteDTO(game));
    },

    getAll: async (req, res) => {
        const { offset, limit } = req.pagination;

        const games = await db.Game.findAll({
            offset, limit
        });

        res.status(200).json(games.map(gameMapper.toShortDTO));
    },

    insert: async (req, res) => {
        // Validation des données
        if (!gameIsValid(req.body)) {
            res.sendStatus(422);
            return;
        }

        // Vérification de doublon
        if (await gameAllReadyExists(req.body)) {
            res.status(409).json({ error: 'Le jeu exists déjà !' });
            return;
        }

        // Ajout des données
        // - Jeu
        const gameToAdd = await db.Game.create({
            name: req.body.name.trim(),
            desc: req.body.desc?.trim(),
            shortDesc: req.body.shortDesc.trim(),
            releaseDate: new Date(req.body.releaseDate),
            cover: req.body.cover,
        });
        // - Mode
        const selectedMode = await db.Mode.findAll({
            where: { name: req.body.modes }
        });
        await gameToAdd.addMode(selectedMode);
        // - Genre
        for (const genre of req.body.genres) {
            const [genreDB] = await db.Genre.findOrCreate({
                where: { name: genre }
            });
            await gameToAdd.addGenre(genreDB);
        }

        // Récuperation de l'objet en DB
        const gameAdded = await db.Game.findByPk(gameToAdd.id, {
            include: [db.Genre, db.Mode]
        });

        // Cloture de la requete
        res.status(201)
            .location(`/api/game/${gameAdded.id}`)
            .json(gameMapper.toCompleteDTO(gameAdded));
    },

    update: async (req, res) => {
        const id = parseInt(req.params.id);

        // Validation des données
        if (!gameIsValid(req.body)) {
            res.sendStatus(422);
            return;
        }

        // Recherche du jeu
        const gameToUpdate = await db.Game.findByPk(id, {
            include: [db.Genre, db.Mode]
        });

        // Si aucun jeu, erreur "not found"
        if (!gameToUpdate) {
            res.sendStatus(404);
            return;
        }

        // Vérification de doublon
        const originalGameName = gameToUpdate.name;
        const originalGameReleaseDate = gameToUpdate.releaseDate;

        if ((originalGameName !== req.body.name || originalGameReleaseDate !== req.body.releaseDate) && gameAllReadyExists(req.body)) {
            res.status(409).json({ error: 'Le jeu exists déjà !' });
            return;
        }

        // Mise à jours
        // - Jeu
        await gameToUpdate.update({
            name: req.body.name,
            desc: req.body.desc,
            shortDesc: req.body.shortDesc,
            releaseDate: req.body.releaseDate,
        });
        // - Mode (Modify)
        const selectedMode = await db.Mode.findAll({
            where: { name: req.body.modes }
        });
        await gameToUpdate.setModes(selectedMode);
        // - Genre (Remove)
        const genreToRemove = gameToUpdate.genres.filter(g => !req.body.genres.includes(g.name));
        await gameToUpdate.removeGenre(genreToRemove);
        // - Genre (Add)
        const genreToAdd = req.body.genres.filter(g => !gameToUpdate.genres.some(gdb => gdb.name === g));
        for (const genre of genreToAdd) {
            const [genreDB] = await db.Genre.findOrCreate({
                where: { name: genre }
            });
            await gameToUpdate.addGenre(genreDB);
        }

        res.sendStatus(204);
    },

    delete: async (req, res) => {
        const id = parseInt(req.params.id);

        const gameToRemove = await db.Game.findByPk(id);
        if (!gameToRemove) {
            res.sendStatus(404);
            return;
        }

        await gameToRemove.destroy();
        res.sendStatus(204);
    },

    uploadCover: async (req, res) => {
        // Récuperation des informations de la requete
        const id = parseInt(req.params.id);
        const cover = req.file;

        // Fausse latence pour la démo (Ne pas faire en prod :p)
        await (new Promise(resolve => setTimeout(resolve, 500)));

        // Rechercher le jeu
        const gameForCover = await db.Game.findByPk(id);
        if (!gameForCover) {
            await fs.unlink(req.file.path);
            res.sendStatus(404);
            return;
        }

        // Mise à jour de la cover du jeu
        gameForCover.cover = cover.path;
        await gameForCover.save();

        // Cloture de la requete
        res.sendStatus(204);
    }
};

export default gameController;