# Maintenance Website - Docker + MySQL + Node.js

Projet de maintenance avec Docker, MySQL et Express.js.

## 📋 Prérequis

- Docker et Docker Compose installés
- Port 3000 (app) et 3306 (MySQL) disponibles

## 🚀 Démarrage rapide

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd maintenance-website
npm install
```

### 2. Lancer avec Docker

```bash
# Démarrer les conteneurs (MySQL + Node.js)
docker-compose up -d

# Ou avec rebuild
docker-compose up -d --build

# Voir les logs
docker-compose logs -f
```

### 3. Vérifier que tout fonctionne

```bash
# Health check
curl http://localhost:3000/health

# Lister les utilisateurs
curl http://localhost:3000/api/users
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Vérifier l'état de l'application et la connexion DB

### Users
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Maintenance Logs
- `GET /api/maintenance` - Liste tous les logs
- `GET /api/maintenance/:id` - Détails d'un log
- `POST /api/maintenance` - Créer un log
  ```json
  {
    "title": "Maintenance serveur",
    "description": "Description détaillée",
    "status": "pending"
  }
  ```
- `PUT /api/maintenance/:id` - Modifier un log
- `DELETE /api/maintenance/:id` - Supprimer un log

## 🗄️ Base de données

La base de données MySQL est automatiquement initialisée avec :
- 2 tables : `users` et `maintenance_logs`
- Données de test pré-chargées

### Accéder à MySQL

```bash
# Connexion au conteneur MySQL
docker exec -it maintenance_mysql mysql -u app_user -papp_password maintenance_db

# Ou depuis l'extérieur
mysql -h 127.0.0.1 -P 3306 -u app_user -papp_password maintenance_db
```

## 🛠️ Scripts disponibles

```bash
npm start          # Démarrer l'app (production)
npm run dev        # Démarrer avec nodemon (dev)
npm run docker:up  # Lancer les conteneurs
npm run docker:down # Arrêter les conteneurs
npm run docker:build # Rebuild et lancer
npm run docker:logs # Voir les logs
```

## 🔧 Configuration

Modifier les variables dans `.env` :

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=maintenance_db
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password
NODE_ENV=development
PORT=3000
```

## 📁 Structure du projet

```
maintenance-website/
├── docker-compose.yml    # Orchestration Docker
├── Dockerfile           # Image Node.js
├── init.sql            # Script d'init MySQL
├── index.js            # Serveur Express
├── db.js              # Connexion et requêtes MySQL
├── .env               # Variables d'environnement
├── .env.example       # Template
└── package.json       # Dépendances npm
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas
```bash
docker-compose down -v
docker-compose up -d --build
```

### Erreur de connexion MySQL
Attendez quelques secondes que MySQL soit prêt (healthcheck automatique).

### Port déjà utilisé
Modifiez les ports dans `docker-compose.yml` :
```yaml
ports:
  - "3001:3000"  # App
  - "3307:3306"  # MySQL
```

## 🧹 Nettoyage

```bash
# Arrêter et supprimer les conteneurs
docker-compose down

# Supprimer aussi les volumes (⚠️ perte de données)
docker-compose down -v
```

## 📝 Exemples d'utilisation

### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com"}'
```

### Créer un log de maintenance
```bash
curl -X POST http://localhost:3000/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{"title":"Backup BDD","description":"Sauvegarde quotidienne","status":"completed"}'
```

### Modifier un statut
```bash
curl -X PUT http://localhost:3000/api/maintenance/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Mise à jour","description":"Terminée","status":"completed"}'
```
