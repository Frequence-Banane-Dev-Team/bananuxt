# Site Web de Fréquence Banane
[![Deploy Nuxt site to Pages](https://github.com/Frequence-Banane-Dev-Team/bananuxt/actions/workflows/deploy.yml/badge.svg)](https://github.com/Frequence-Banane-Dev-Team/bananuxt/actions/workflows/deploy.yml)

Ce repository contient le site web de Fréquence Banane.
Les technologies utilisées sont les suivants :
- **Vue3JS** : Framework Javascript 
- **Nuxt 3** : Framework basé sur Vue qui permet de faire du Server Side Rendering (SSR) ou de générer un site entièrement statique
- **Tailwind CSS** : Bibliotheque CSS contenant des classes utilitaires 
- **Strapi** : Headless CMS qui gère tout le contenu du site web et met à disposition une interface de gestion de ce contenu


## Installation

Veuillez installer les dépendances en premier lieu. Les commandes suivantes sont équivalentes et dépendent des gestionnaires de paquets installés sur votre ordinateur

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Serveur de développement

Une fois les dépendances installées vous pouvez démarrer le serveur de développement sur `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Pour générer les fichiers à déployer sur le site web vous pouvez utiliser la commande suivante (les fichiers se trouveront dans le repertoire `.output/public`):

```bash
# npm
npm run generate

# pnpm
pnpm run generate

# yarn
yarn generate

# bun
bun run generate
```

Pour prévisualiser localement ce qui a été généré vous pouvez lancer un serveur :

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

## Variable d'environnement
L'url de l'API strapi est défini par une variable d'environnement, soit en local sur l'ordinateur, soit via une variable d'environnement sur github utilisée lors de la génération du site via un workflow github (accessible dans les réglages du repository). 


Vous pouvez accéder à la [documentation de Nuxt](https://nuxt.com/docs/getting-started/deployment) pour plus d'informations.
