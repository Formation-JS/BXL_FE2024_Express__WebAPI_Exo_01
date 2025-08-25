# Express - Exo 04
Création d'une Web API sur le thème des jeux vidéo

## Mettre en place un nouveau projet avec Node
- L'application doit être initialiser avec npm.  
- Elle doit être structuré avec des dossiers : 
  - controllers
  - routers
- Les endpoints doivent être sous la forme : `/api/<ressource>/...`
- Les données initial sont fourni en `game.json`

## Mettre en place les routes suivantes 

### Obtenir la liste des jeux vidéo
Le endpoint permet d'obtenir liste avec les données suivantes : `id`, `nom`, `shortDesc`.  
Les résultats doivent être limité par un `offset` et une `limit`. 

### Obtenir les détails d'un jeu
Le endpoint permet d'obtenir les détails d'un jeux à l'aide de son `id`.  
Envoyer toutes les données de l'objet au format JSON.  
Si aucune donnée n'est trouvé, envoyer une erreur `404`.

### Ajouter un jeu
Le endpoint doit permettre d'ajouter un nouveau jeu.  
Une validation des données est nécessaire : 
- Tout les champs a part `description` et `cover` sont obligatoire.
- Les valeurs possibles pour le champs `mode` sont uniquement `solo` et `multi`.
- NB : Initialiser le champ `cover` à null, il sera géré plus tard :p 
Si les données sont invalides, envoyer une erreur `422`.

### Modifier les détails d'un jeu
Le endpoint doit permettre de modifier un jeu existant à l'aide de sont `id`.
Tout les champs à part l'identifiant sont modifiable avec les même règles de validation que lors de l'ajout. La mise à jours doit être une modification complete du jeu (hors champs `cover`).  
Si aucune donnée n'est trouvé, envoyer une erreur `404`.

### Supprimer un jeu
Le endpoint permet de supprimer un jeu.  
Si le jeux a bien été trouvé et supprimé, envoyer une code `204` sinon `404`.


## Aller plus loin

### Obtenir les images des jeux
Ajouter le nécessaire pour rendre accessible les images des jeux.  
Les images doivent être placer dans un dossier `public` dans votre projet.

### Ajouter ou modifier les images des jeux
Le endpoint `(PATCH) /api/<ressource>/:id/cover` qui permet d'ajouter ou modifier une image à un jeu.  
Il sera donc nécessaire que le serveur gere les images, pour cela, ajouter le middleware `multer`.  
Documentation : https://github.com/expressjs/multer

### Éviter les doublons de jeux
Lors de l'ajoute d'un jeu vérifier que celui-ci ne soit pas un doublon.  
Si c'est le cas, envoyer une erreur `409` avec une message d'erreur.
