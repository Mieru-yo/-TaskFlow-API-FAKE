# TaskFlow API

![Pipeline](https://img.shields.io/badge/CI%2FCD-Jenkins-blue)
![Node](https://img.shields.io/badge/Node.js-18-green)
![Docker](https://img.shields.io/badge/Docker-Compose-informational)

REST API de gestion de tâches, industrialisée avec Jenkins CI/CD, Docker et Nginx.

---

## Description

TaskFlow API est une API REST construite avec **Node.js + Express** et **MongoDB**. Elle expose des routes CRUD pour gérer des tâches (`todo`, `in-progress`, `done`). L'ensemble de l'infrastructure est conteneurisée avec Docker Compose et automatisée via un pipeline Jenkins déclaratif en 7 stages.

---

## Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)
- Jenkins accessible sur le réseau (inclus dans le Compose)

---

## Démarrage rapide

```bash
git clone https://github.com/Mieru-yo/-TaskFlow-API.git
cd TaskFlow-API
cp .env.example .env   # renseigner MONGO_URI et PORT
docker compose up -d
```

L'API est disponible via Nginx sur `http://localhost/api/tasks`.  
Jenkins est disponible sur `http://localhost:8080`.

---

## Variables d'environnement

| Variable    | Description                        | Exemple                                  |
|-------------|-----------------------------------|------------------------------------------|
| `MONGO_URI` | URI de connexion MongoDB           | `mongodb://mongodb:27017/taskflow`       |
| `PORT`      | Port d'écoute de l'API             | `5000`                                   |
| `NODE_ENV`  | Environnement d'exécution          | `production`                             |

---

## Endpoints REST

| Méthode | Route              | Description                              |
|---------|--------------------|------------------------------------------|
| GET     | `/health`          | Health check (`{status, uptime, version}`) |
| GET     | `/api/tasks`       | Liste toutes les tâches                  |
| POST    | `/api/tasks`       | Crée une tâche                           |
| GET     | `/api/tasks/:id`   | Retourne une tâche par son id            |
| PUT     | `/api/tasks/:id`   | Met à jour une tâche                     |
| DELETE  | `/api/tasks/:id`   | Supprime une tâche                       |

---

## Architecture du pipeline

```
GitHub Push
    │
    ▼
Jenkins (Webhook)
    │
    ├── Stage 1 — Checkout    : git clone du repo
    ├── Stage 2 — Install     : npm ci
    ├── Stage 3 — Lint        : npm run lint (échec si violation ESLint)
    ├── Stage 4 — Test        : npm test --coverage (échec si test KO)
    ├── Stage 5 — Build Docker: docker build :latest + :build-N
    ├── Stage 6 — Deploy      : docker compose up -d
    └── Stage 7 — Notify      : message de succès + URL
          │
          └── post { always | success | failure }
```

---

## Architecture des services

```
Internet
   │
   ▼ :80
 Nginx (reverse proxy)
   │
   ▼ :5000
 API (Node.js / Express)        Jenkins :8080
   │
   ▼
 MongoDB (réseau interne uniquement)
```

- MongoDB n'est **pas exposé** à l'extérieur (port 27017 non mappé sur l'hôte)
- Seul le port **80** est public

---

## Répartition des tâches

| Tâche                                  | Membre 1 (Nell) | Membre 2 (Léo) |
|----------------------------------------|:--------------:|:--------------:|
| Initialisation du projet               | ✓              |                |
| Route `/health`                        | ✓              |                |
| Routes CRUD `/api/tasks`               | ✓              |                |
| Connexion MongoDB (`db.js`)            | ✓              |                |
| Docker Compose                         | ✓              |                |
| Jenkinsfile (pipeline 7 stages)        | ✓              |                |
| README                                 | ✓              |                |
| Modèle Mongoose `Task`                 |                | ✓              |
| Configuration ESLint                   |                | ✓              |
| Tests Jest (unitaires + intégration)   |                | ✓              |
| Dockerfile multi-stage                 |                | ✓              |
| Configuration Nginx                    |                | ✓              |
| Stage bonus Jenkins                    |                | ✓              |

---

*YNOV Campus — M1 DevOps — Projet Final CI/CD 2025-2026*
