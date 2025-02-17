# Utiliser l'image officielle Node.js comme base
FROM node:16

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

# Démarrer l'application
CMD ["node", "app.js"]
