Fournier Enzo - Cailliau Ethann - Dupuis Brian - Groupe 1

# Maintenance Website - Docker + MySQL + Node.js

Projet de maintenance avec Docker, MySQL et Express.js.

---

## Prerequis

- Docker et Docker Compose installes
- Port 3000 (app) et 3306 (MySQL) disponibles

## Demarrage rapide

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd maintenance-website
npm install
```

### 2. Lancer avec Docker

```bash
# Demarrer les conteneurs (MySQL + Node.js)
docker-compose up -d

# Ou avec rebuild
docker-compose up -d --build

# Voir les logs
docker-compose logs -f
```

### 3. Acceder a l'application

- **Interface web**: http://localhost:3000
- **API info**: http://localhost:3000/api
- **Health check**: http://localhost:3000/health

---

## API Endpoints

### Health Check
- `GET /health` - Verifier l'etat de l'application et la connexion DB

### Login
- `POST /api/login` - Authentification
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Users
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Details d'un utilisateur
- `POST /api/users` - Creer un utilisateur
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
- `GET /api/maintenance/:id` - Details d'un log
- `POST /api/maintenance` - Creer un log
  ```json
  {
    "title": "Maintenance serveur",
    "description": "Description detaillee",
    "status": "pending"
  }
  ```
- `PUT /api/maintenance/:id` - Modifier un log
- `DELETE /api/maintenance/:id` - Supprimer un log

---

## Base de donnees

La base de donnees MySQL est automatiquement initialisee avec :
- 2 tables : `users` et `tasks`
- Donnees de test pre-chargees (4 utilisateurs)

### Utilisateurs de test

| Nom | Email | Mot de passe |
|-----|-------|--------------|
| John Smith | john@example.com | password123 |
| Jane Doe | jane@example.com | securepass |
| Bob Martin | bob@example.com | mypassword |
| Dante Alighieri | dante@example.com | divinecomedy |

### Acceder a MySQL

```bash
# Connexion au conteneur MySQL
docker exec -it maintenance_mysql mysql -u app_user -papp_password maintenance_db

# Ou depuis l'exterieur
mysql -h 127.0.0.1 -P 3306 -u app_user -papp_password maintenance_db
```

---

## Scripts disponibles

```bash
npm start          # Demarrer l'app (production)
npm run dev        # Demarrer avec nodemon (dev)
npm run docker:up  # Lancer les conteneurs
npm run docker:down # Arreter les conteneurs
npm run docker:build # Rebuild et lancer
npm run docker:logs # Voir les logs
```

---

## Structure du projet

```
maintenance-website/
├── docker-compose.yml    # Orchestration Docker
├── Dockerfile            # Image Node.js
├── init.sql              # Script d'init MySQL
├── index.js              # Serveur Express + routes
├── db.js                 # Connexion et requetes MySQL
├── public/
│   └── index.html        # Interface web de login
├── .env                  # Variables d'environnement
├── .env.example          # Template
└── package.json          # Dependances npm
```

---

## Depannage

### Les conteneurs ne demarrent pas
```bash
docker-compose down -v
docker-compose up -d --build
```

### Erreur de connexion MySQL
Attendez quelques secondes que MySQL soit pret (healthcheck automatique).

### Port deja utilise
Modifiez les ports dans `docker-compose.yml` :
```yaml
ports:
  - "3001:3000"  # App
  - "3307:3306"  # MySQL
```

---

## Nettoyage

```bash
# Arreter et supprimer les conteneurs
docker-compose down

# Supprimer aussi les volumes (perte de donnees)
docker-compose down -v
```
