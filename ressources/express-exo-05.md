# Express - Exo 05
Sur base de la Web API sur le thème des jeux vidéo (express-exo-04).  
Modifier le application pour que celle-ci utilise une base de donnée à la place du fichier JSON

## Mise en place de sequelize dans le projet
Installer les packages pour sequelize pour `PostgreSQL`.  
Créer le fichier `model/index.js` avec le nécessaire pour l'initialiser.  

## Modéliser et créer le modele pour les données de la Web API
Créer le fichier `model/game.model.js` avec la configuration nécessaire pour sequilize  

### BONUS : 
Mettre en place les models :
- Les données d'un jeu (`model/game.model.js`)
- Les genres (`model/genre.model.js`)
- Les mode de jeu (`model/gameMode.model.js`)

## Modifier le code des méthodes de `gameController`
Adapter le code du controller pour utiliser la base de donnée à la place du Fichier JSON
