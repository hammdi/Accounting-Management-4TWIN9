# Utiliser l'image officielle Node.js comme base
FROM node:20.9.0

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 5000

# Lancer le script d'importation CSV avant le serveur principal
CMD ["bash", "-c", "node ImportCSV.js && node app.js"]
