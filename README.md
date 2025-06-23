# Camagru

## Launch

Before starting the project, you need to create a `.env` file at the root of the project with the following environment variables:

- `FRONT_PORT`
- `BACKEND_PORT`
- `SERVER_PORT`
- `SERVER_HOST`
- `FRONT_URL`
- `MONGO_URI`
- `MONGO_HOST`
- `MONGO_PORT`
- `MONGO_DB`
- `MONGO_USER`
- `MONGO_PASSWORD`
- `JWT_SECRET`
- `EMAIL`
- `EMAIL_PASSWORD`

Once the `.env` file is in place, you can start the application with the following command:

```bash
docker compose up --build
```

## Overview

This project is a re-implementation of the Camagru subject, which was initially intended to be developed in PHP. However, in accordance with the instructions allowing the use of any technology "similar to the PHP standard library," I chose to use **Node.js** for the backend. This decision is motivated by two main reasons:

1. **Professional context**: I currently work in an environment where the main technical stacks are **Node.js** for the backend and **Next.js** (React) for the frontend. Using these technologies allows me to strengthen skills that are directly applicable in my work-study program and to align with the practices of my company.
2. **Employability**: Node.js and Next.js are now standards in modern web development, both for building APIs and for creating efficient user interfaces.

## Technical Architecture

- **Backend**: Node.js (+ TypeScript)
- **Frontend**: Next.js (+ TypeScript)
- **Database**: MongoDB

### Why MongoDB?

The choice of **MongoDB** (a NoSQL database) is consistent with my professional experience. In my company, I regularly use AWS services, especially **DynamoDB**, which is also a NoSQL database. Using MongoDB for this project allows me to stay aligned with professional tools and to move away from traditional relational databases, thus matching the realities of the job market and improving my employability.

## Link with the subject

The project respects the spirit of the Camagru subject while adapting to modern technologies and the needs of the professional world. The backend is not in PHP but in Node.js, which remains in line with the instruction to use technologies similar to the PHP standard library.




<br><br><br>

###  #######################-[ Francais ]-#######################

## Lancement: 
Avant de lancer le projet, il est nécessaire de créer un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :

- `FRONT_PORT`
- `BACKEND_PORT`
- `SERVER_PORT`
- `SERVER_HOST`
- `FRONT_URL`
- `MONGO_URI`
- `MONGO_HOST`
- `MONGO_PORT`
- `MONGO_DB`
- `MONGO_USER`
- `MONGO_PASSWORD`
- `JWT_SECRET`
- `EMAIL`
- `EMAIL_PASSWORD`

Une fois le fichier `.env` en place, tu peux démarrer l'application avec la commande :

```bash
docker compose up --build
```

## Présentation

Ce projet est une ré-implémentation du sujet Camagru, initialement prévu pour être réalisé en PHP. Cependant, conformément à la consigne du sujet qui autorise l'utilisation de toute technologie "ressemblant à la librairie standard PHP", j'ai fait le choix d'utiliser **Node.js** pour le backend. Ce choix est motivé par deux raisons principales :

1. **Contexte professionnel** : J'évolue actuellement dans un environnement où les stacks techniques principales sont **Node.js** pour le backend et **Next.js** (React) pour le frontend. Utiliser ces technologies me permet de renforcer mes compétences directement applicables dans mon alternance et d'être en phase avec les pratiques de mon entreprise.
2. **Employabilité** : Node.js et Next.js sont aujourd'hui des standards dans le développement web moderne, tant pour la création d'APIs que d'interfaces utilisateurs performantes.

## Architecture technique

- **Backend** : Node.js ( + TypeScript)
- **Frontend** : Next.js ( + TypeScript)
- **Base de données** : MongoDB

### Pourquoi MongoDB ?

Le choix de **MongoDB** (base de données NoSQL) s'inscrit dans la continuité de mon expérience professionnelle. En entreprise, j'utilise régulièrement les services AWS, notamment **DynamoDB**, qui est également une base NoSQL. Utiliser MongoDB pour ce projet me permet donc de rester cohérent avec les outils du monde professionnel et de m'éloigner des bases de données relationnelles classiques, afin de coller à la réalité du marché et d'améliorer mon employabilité.

## Lien avec le sujet

Le projet respecte l'esprit du sujet Camagru, tout en s'adaptant aux technologies modernes et aux besoins du monde professionnel. Le backend n'est pas en PHP mais en Node.js, ce qui reste conforme à la consigne d'utiliser des technologies similaires à la librairie standard PHP.
