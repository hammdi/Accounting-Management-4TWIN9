# Utiliser l'image officielle Node.js comme base
FROM node:20.9.0

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install
#RUN apt update && apt install -y mongodb-clients
#RUN apt update && apt install -y wget && wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
 #   echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
  #  apt update && apt install -y mongodb-org-tools


# Copier le reste des fichiers du projet
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 5000

# Démarrer l'application
CMD ["node", "app.js"]
