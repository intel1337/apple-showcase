# Apple Store Clone

Un clone moderne d'une boutique Apple avec authentification, panier d'achat et paiement Stripe.
![ScreenRecording2025-05-21at9 38 33AM-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/2b28ad8d-e211-4fb4-92e3-b7381eed38ba)


## 🚀 Stack Technique

### Frontend
- **Framework**: SvelteKit
- **Langage**: JavaScript
- **UI**: CSS personnalisé avec design Apple
- **État**: Stores Svelte
- **Icônes**: Material Design Icons

### Backend
- **Framework**: Node.js avec Express
- **Base de données**: MySQL (Docker)
- **Authentification**: JWT
- **Paiement**: Stripe
- **API**: RESTful

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- Docker
- npm ou yarn
- Un compte Stripe (pour les paiements)


## 🛠 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/intel1337/apple-showcase/
cd apple-showcase
```

2. **Configurer la base de données**
```bash
# Démarrer le container MySQL
docker run --name bdd -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root -e MARIADB_DATABASE=mini_shop mariadb
```

3. **Installer les dépendances Backend**
```bash
cd back
npm install
```

4. **Installer les dépendances Frontend**
```bash
cd front
npm install
```

5. **Configurer les variables d'environnement**

Créez un fichier `.env` dans le dossier `back` :
```env
JWT_SECRET=votre_secret_jwt 
```

6. **Configurer le Projet**
```bash
cd back
cd auth
# Ouvrez auth.js et modifiez votre clé api Si ENV marche pas
```

7. **Config la db**
```js
const HOST = 0.0.0.0
host: HOST,
        user: "root",
        password: "root",
        database: "shop"
```

## 🚀 Lancer le projet

1. **Démarrer le backend**
```bash
cd back
npm run start
```

2. **Démarrer le frontend**
```bash
cd front
npm run dev
```

3. **Seeder la base de données (optionnel)**
```bash
cd back
node seeder/seeder.js
```

## 📁 Structure du Projet

```
├── back/                 # Backend Node.js
│   ├── server.js        # Point d'entrée du serveur
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes API
│   └── seeder/          # Scripts de seeding
│
├── front/               # Frontend SvelteKit
│   ├── src/
│   │   ├── lib/        # Composants et stores
│   │   └── routes/     # Pages de l'application
│   └── static/         # Assets statiques
│
└── docker-compose.yml   # Configuration Docker
```

## 🔑 Fonctionnalités

- 🔐 Authentification utilisateur
- 🛒 Panier d'achat
- 💳 Paiement Stripe
- 👤 Profil utilisateur
- 📱 Design responsive
- 🎨 Interface style Apple

## 🛠 Dépendances Principales

### Backend
- express
- mysql2
- jsonwebtoken
- bcrypt
- cors
- dotenv
- stripe

### Frontend
- svelte
- sveltekit
- axios
- @stripe/stripe-js

## 🐳 Docker

Le projet utilise Docker pour la base de données MySQL. La configuration est dans le fichier `docker-compose.yml` :

```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: shop
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🔒 Sécurité

- Authentification JWT
- Protection des routes sensibles
- Validation des données
- Gestion sécurisée des mots de passe
- Protection CORS

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- intel1337

## 🙏 Remerciements

- Apple pour l'inspiration du design
- La communauté SvelteKit
- Stripe pour l'API de paiement 
