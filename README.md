# Courses_IA_Plateforme
Plateforme Éducative avec IA

Cette application est une plateforme éducative en ligne intégrant des fonctionnalités **IA avancées** :  

- Analyse des reviews de cours  
- Génération automatique de descriptions de cours  
- Suggestions de cours personnalisés  
- Générateur de bio pour les profils utilisateurs  
- Dashboard Admin avec insights globaux de la plateforme  

---

Plateforme d'apprentissage en ligne construite avec la stack **MongoDB, Express, React et Node.js**.  
Cette application inclut des fonctionnalités IA avancées : analyse des reviews, génération de descriptions, suggestions de cours, génération de bios et dashboard admin.

---
## Installation & démarrage

Backend
cd Backend
npm install
npm run dev        


Le serveur tourne sur http://localhost:5000.

Frontend
cd Frontend
npm install
npm run dev     # mode développement
npm run build   # production
npm run preview # prévisualiser le build

## Sommaire

- [Stack & fonctionnalités](#stack--fonctionnalités)  
- [Structure du dépôt](#structure-du-dépôt)  
- [Prérequis](#prérequis)  
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)  
- [Installation & démarrage](#installation--démarrage)  
- [API principale](#api-principale)  
- [Bonnes pratiques Git / Push](#bonnes-pratiques-git--push)  
- [Scripts utiles](#scripts-utiles)  
- [Captures d'écran](#captures-décran)  

---

---

## Prérequis

- Node.js ≥ 18  
- npm ≥ 10  
- MongoDB (locale ou Atlas)  
- Git configuré (nom & email)  

---

## Configuration des variables d'environnement

Créer un fichier `Back/.env` :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eduplatform
JWT_SECRET=votre_secret_jwt
GEMINI_API_KEY=votre_clé_api_gemini


## Stack & fonctionnalités

### Backend (`Back/`)
- **Node.js + Express 5 + Mongoose 9**  
- Authentification JWT  
- Gestion des utilisateurs, cours et reviews  
- Middleware `protect` pour sécuriser les routes  
- Modèles MongoDB : `User`, `Course`, `Review`  
- Routes IA : analyse des reviews, génération de descriptions et bios, suggestions de cours, dashboard admin  

### Frontend (`Front/Eduplatform_Front/`)
- **React 19 + Vite + React Router 7**  
- Contexte d'authentification (`AuthProvider`, `useAuth`) + stockage du token dans `localStorage`  
- Pages principales : Accueil, Liste des cours, Détails d'un cours, Profil, Login, Register  
- `ProtectedRoute` pour sécuriser l’accès aux pages privées  
- Intégration IA via API interne (`gemini`)  

---

## Structure du dépôt
Projet_edu/
├── Backend/
│ ├── server.js
│ ├── routes/ (authRoutes, courseRoutes, userRoutes, aiRoutes)
│ ├── models/ (User, Course, Review)
│ ├── middleware/ (authMiddleware.js)
│ └── config/
      └──gemini.js
      └──db.js
└── Frontend/
├── src/
│ ├── api/axios.js
│ ├── context/ (AuthContext, useAuth)
│ ├── components/ (Navbar, ProtectedRoute)
│ └── pages/ (...)
└── vite.config.js
<img width="595" height="560" alt="image" src="https://github.com/user-attachments/assets/6b9b87a0-af1b-47cf-963a-ee32915a839f" />

