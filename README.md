# Frontend Vue.js – Interactive Fiction

Cette application Vue.js, construite avec Vite, consomme l’API Laravel du backend pour afficher et naviguer dans des histoires interactives « livre dont vous êtes le héros ».

---

## 🛠️ Prérequis

* Node.js ≥ 16
* npm ≥ 8 (ou Yarn ≥ 1.22)
* Un backend Laravel accessible (ex. `http://localhost:8000/api/v1`)

---

## 🚀 Installation

1. **Cloner le dépôt frontend**

   ```bash
   git clone <url-du-frontend> frontend
   cd frontend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer l’URL de l’API**
   Par défaut, l’API pointe sur `http://localhost:8000/api/v1`.
   Si besoin, éditez `src/api/api.js` et modifiez `baseURL`.

---

## 📂 Structure du dossier `src/`

```
src/
├── api/
│   └── api.js           # Instance Axios + interceptors + fonctions API
├── assets/
│   
├── components/
│   └── ErrorToast.vue   # Toast d’erreur réutilisable
├── views/
│   ├── StoriesView.vue  # Liste des histoires (+ gestion de progression)
│   └── ChapterView.vue  # Affichage d’un chapitre + choix / épilogue
├── router/
│   └── index.js         # Routes Vue Router: /stories, /stories/:sid/:cid
├── App.vue              # Point d’entrée Vue (affiche <router-view/>)
└── main.js              # Bootstrapping (création de l’app, injection du token)
```

---

## ⚙️ Scripts disponibles

| Commande          | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Démarre le serveur de développement (Vite)     |

---

## 🎯 Fonctionnalités clés

1. **Liste des histoires**

   * Affiche des cartes responsives
   * Boutons « Commencer », « Reprendre » ou « Recommencer » selon progression

2. **Navigation dynamique**

   * Vue de chapitre chargée par ordre
   * Conservation de la progression dans `localStorage`

3. **Affichage du chapitre & choix**

   * Choix redirige vers le chapitre suivant
   * Épilogue (fin) avec bouton de redémarrage

4. **Gestion des erreurs**

   * `ErrorToast.vue` pour afficher les erreurs réseau ou API
   * Messages uniformes et temporisés

---

## 🔐 Authentification (stateless)

* Après `login` (via API backend), le token est stocké en `localStorage` et injecté dans l’en-tête `Authorization` de chaque requête Axios.
* Aucun cookie ni configuration CSRF n’est nécessaire côté frontend.

---

## 🏁 Lancer l’application

1. Assurez-vous que le backend tourne sur `http://localhost:8000`.
2. Dans le dossier `frontend`, lancez :

   ```bash
   npm run dev
   ```
3. Ouvrez votre navigateur sur `http://localhost:5173/stories`.

---

## 📖 Lisibilité & Maintenance

* **Composants modulaires** : chaque vue et toast sont isolés.
* **API centralisée** : les appels et la gestion des tokens sont dans `src/api/api.js`.
* **Styles scoped** : chaque composant gère ses propres styles pour éviter les conflits.