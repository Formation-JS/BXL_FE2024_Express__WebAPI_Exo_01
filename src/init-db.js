import db from './models/index.js';

try {
    await db.sequelize.authenticate();

    console.log(chalk.blueBright('Initialisation de la DB'));
    await db.sequelize.sync({ force: true });

    console.log(chalk.blueBright('Ajout de données initials'));
    console.log(chalk.magentaBright(' - Mode de jeux'));
    const [solo, multi] = await db.Mode.bulkCreate([
        { name: 'Solo' },
        { name: 'Multi' }
    ]);
    console.log(chalk.magentaBright(' - Un jeu exemple'));
    const game1 = await db.Game.create({
        name: 'The Legend of Zelda: Breath of the Wild',
        desc: 'Plongez dans Hyrule en tant que Link, réveillé d\'un sommeil centenaire. Explorez un vaste monde ouvert, combinez outils et créativité pour résoudre des énigmes, affrontez Calamité Ganon et restaurez la paix en libérant les gardiens ancestraux.',
        shortDesc: 'Exploration en monde ouvert',
        releaseDate: '2017-03-03',
        genres: [
            { name: 'Action' }, 
            { name: 'Aventure' }
        ],
        cover: '/public/cover/zelda-botw.png',
    });
    await game1.addMode(solo);

    console.log(chalk.greenBright('L\'initialisation de la DB est terminé avec succes !'));
}
catch (error) {
    console.log(error);
}