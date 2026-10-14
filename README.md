# Certix Passport

> Le passeport digital des étudiants du club **SESAME Certix **.

![Version](https://img.shields.io/badge/version-1.0-blue)
![Statut](https://img.shields.io/badge/statut-en%20développement-orange)
![Durée](https://img.shields.io/badge/planning-8%20semaines-green)

Certix Passport est une plateforme où chaque membre du club SESAME Certix  dispose d'un **portfolio digital** regroupant son parcours (activités du club, stages, certifications, projets), partageable par **lien unique** et **QR code**.

---

## Table des matières

1. [Contexte et objectif](#contexte-et-objectif)
2. [Principe clé : la confiance](#principe-clé--la-confiance)
3. [Fonctionnalités](#fonctionnalités)
4. [Hors périmètre (v1)](#hors-périmètre-v1)
5. [Exigences non fonctionnelles](#exigences-non-fonctionnelles)
6. [Stack technique](#stack-technique)
7. [Installation](#installation)
8. [Structure du projet](#structure-du-projet)
9. [Organisation de l'équipe](#organisation-de-léquipe)
10. [Planning](#planning)
11. [Workflow Git](#workflow-git)
12. [Critères de réussite](#critères-de-réussite)
13. [Documentation](#documentation)

---

## Contexte et objectif

Le club SESAME Certix  organise des workshops, hackathons, compétitions et événements. Aujourd'hui, la participation des membres n'est pas centralisée et les étudiants n'ont aucun moyen simple de la prouver à un recruteur.

**Objectif :** offrir à chaque membre un passport crédible, prêt à partager, consultable en quelques secondes via un QR code.

| Pour qui ? | Valeur ajoutée |
| --- | --- |
| **Étudiant** | Un portfolio crédible qui valorise son parcours |
| **Club** | Reconnaissance officielle de ses activités, meilleure image |
| **Recruteur** | Un parcours vérifié, consultable rapidement |

## Principe clé : la confiance

Chaque élément du passport porte un statut visible :

- ✅ **Vérifié par SESAME** : attribué par le bureau du club.
- 📝 **Déclaré par l'étudiant** : ajout manuel, en attente ou après validation.

C'est ce qui donne de la valeur au passport.

## Fonctionnalités

### Côté étudiant

- Inscription, connexion et réinitialisation du mot de passe
- Profil : photo, bio, filière, niveau, liens LinkedIn et GitHub
- Achievements automatiques du club (workshops, hackathons, compétitions, événements)
- Ajout manuel de stages, certifications et projets, avec justificatif (PDF ou image)
- Visibilité (public / privé) configurable pour chaque élément
- Lien public unique et QR code téléchargeable
- Export du passport en PDF

### Côté administrateur (bureau du club)

- Création des événements (type, date, description)
- Attribution des achievements, un par un ou par **import CSV**
- Validation ou refus des ajouts manuels (avec motif en cas de refus)
- Gestion des membres (activation, désactivation, rôles)
- Dashboard : membres, événements, participations, passports consultés

### Page publique

- Accessible **sans compte** via le lien ou le QR code
- N'affiche que les éléments rendus publics par l'étudiant
- Distingue visuellement les éléments « Vérifié par SESAME » des éléments « Déclaré »

## Hors périmètre (v1)

- Application mobile native (le site responsive suffit)
- Paiement ou abonnement
- Messagerie interne entre membres
- Intégration automatique avec LinkedIn

> Toute nouvelle idée va dans une liste **« Version 2 »** validée par le Project Manager.

## Exigences non fonctionnelles

| Domaine | Exigence |
| --- | --- |
| Responsive | Conçu *mobile first* : le QR code sera surtout scanné au téléphone |
| Sécurité | Mots de passe hashés, rôles étudiant/admin, protection des routes, HTTPS, validation des fichiers téléversés |
| Vie privée | L'étudiant contrôle ce qui est public et peut désactiver son lien à tout moment |
| Performance | Page publique chargée en moins de 3 s sur une connexion mobile moyenne |
| Langue | Interface en français (anglais en option) |
| Maintenabilité | Code versionné sur GitHub, documentation de l'API et du déploiement |

## Stack technique

> Suggestion, à valider avec les développeurs selon leurs compétences.

| Couche | Technologie |
| --- | --- |
| Frontend | React ou Next.js |
| Backend | Node.js (Express) ou Django |
| Base de données | PostgreSQL |
| QR code | Bibliothèque dédiée (ex. `qrcode`) |
| Hébergement | Vercel (frontend) et Render (backend + base) |
| Design | Figma |
| Suivi | Trello ou Notion |
| Code | GitHub |

## Installation

> ⚠️ Section à compléter par les équipes Backend / DevOps une fois la stack figée.

```bash
# 1. Cloner le dépôt
git clone https://github.com/<organisation>/certix-passport.git
cd certix-passport

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Installer et lancer le backend
cd backend
npm install        # ou : pip install -r requirements.txt
npm run dev

# 4. Installer et lancer le frontend
cd ../frontend
npm install
npm run dev
```

### Variables d'environnement (exemple)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/certix
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:3000
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

## Structure du projet

> Proposition, à adapter selon la stack retenue.

```
certix-passport/
├── frontend/        # Pages étudiant, page publique, dashboard admin
├── backend/         # API, authentification, achievements, import CSV
├── docs/            # Cahier des charges, maquettes, doc API, déploiement
├── .env.example
└── README.md
```


## Organisation de l'équipe

**15 personnes** : 1 Project Manager + 14 membres. Le PM assure le suivi sans réaliser de tâches techniques et communique principalement avec les leads d'équipe.

| Équipe | Nb | Mission |
| --- | :-: | --- |
| UI/UX | 2 | Maquettes Figma, charte graphique, parcours utilisateur |
| Frontend | 3 | Pages étudiant, page publique, dashboard admin |
| Backend | 3 | API, authentification, logique des achievements, import CSV |
| Base de données / Sécurité | 1 | Modèle de données, permissions, sécurité |
| QA / Tests | 1 | Plan de tests, tests manuels, suivi des bugs |
| DevOps | 1 | Hébergement, déploiement, nom de domaine, sauvegardes |
| Communication | 2 | Lancement, visuels, collecte des données historiques |
| Documentation / Analyste | 1 | Comptes-rendus, documentation, suivi des livrables |

**Outils de suivi :** board Trello/Notion (À faire / En cours / En revue / Terminé), point hebdomadaire de 20 à 30 min, un groupe de discussion par équipe + un groupe général.

## Planning

| Période | Phase | Livrables |
| --- | --- | --- |
| Semaines 1-2 | Cadrage et conception | Maquettes des écrans clés, modèle de données, choix techniques, environnement de dev |
| Semaines 3-5 | Développement | Authentification, profil, achievements, QR code, page publique |
| Semaine 6 | Administration | Dashboard admin, import CSV, validation des ajouts manuels |
| Semaine 7 | Tests et corrections | Tests complets, correction des bugs, tests de sécurité de base |
| Semaine 8 | Lancement | Déploiement, saisie des données des membres, annonce officielle |

### Priorités des user stories

- **P1** : indispensable pour le lancement
- **P2** : important
- **P3** : si le temps le permet

Les user stories détaillées (Étudiant E1–E10, Admin A1–A7, Visiteur V1–V3) sont décrites dans le cahier des charges.

## Workflow Git

- Un seul dépôt GitHub
- Une branche par fonctionnalité (ex. `feature/qr-code`)
- **Revue de code obligatoire** avant toute fusion dans `main`
- Déploiement automatique à chaque fusion

```bash
git checkout -b feature/nom-de-la-fonctionnalite
git commit -m "feat: description courte"
git push origin feature/nom-de-la-fonctionnalite
# puis ouvrir une Pull Request
```

## Critères de réussite

- [ ] Tous les éléments P1 des user stories sont livrés et testés
- [ ] Au moins 80 % des membres actuels ont un passport rempli au lancement
- [ ] Le QR code s'ouvre correctement sur iPhone et Android
- [ ] Aucune donnée privée n'est visible sur la page publique
- [ ] Le projet est livré dans les 8 semaines prévues

## Documentation

- 📄 Cahier des charges complet : `docs/Certix_Passport_Cahier_des_charges.docx`
- 🎨 Maquettes Figma : *lien à ajouter*
- 🔌 Documentation de l'API : *à ajouter (semaines 5-7)*
- 🚀 Guide de déploiement : *à ajouter (semaines 5-7)*

---

**Certix Passport** — Club SESAME — Version 1.0, octobre 2026
