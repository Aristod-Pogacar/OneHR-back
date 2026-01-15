# 📌 Admin One

## 🧾 Description
**Admin One** est une application web d’administration destinée à accompagner un projet mobile de **demande de congé, de permission et d’intervention médicale** pour les employés de l’entreprise **Aquarelle** (Antsirabe & Antananarivo).

Elle permet aux administrateurs et responsables RH de gérer et suivre l’ensemble des demandes qui étaient auparavant traitées **manuellement sur papier**.

---

## 🎯 Objectif du projet
- Digitaliser les processus RH (congés, permissions, suivi médical)
- Centraliser les données des employés
- Réduire les traitements manuels et les erreurs
- Synchroniser les données avec la plateforme **OneHR (PeopleStrong)** via une **automatisation Puppeteer** (sans API)

---

## 🏢 Périmètre fonctionnel
L’application couvre les sites suivants :
- Aquarelle Antsirabe  
- Laguna Antsirabe  
- Aquarelle Antananarivo  

---

## ⚙️ Fonctionnalités principales
- 📋 Consultation de la liste des employés
- 📥 Import des employés via **Excel (Master File)**
- 🏥 Suivi des employés inscrits pour une intervention médicale
- 🗓️ Gestion et suivi :
  - Congés
  - Permissions
  - Permissions de 2 heures
- 🏥 Paramétrage des services médicaux partenaires  
  *(ex : SMIA, OSTIE)*
- 👥 Gestion des utilisateurs et de leurs rôles
- 🧾 Consultation de la liste des **Payroll Officers**
- 🔄 Envoi automatisé des données vers **OneHR** via Puppeteer

---

## 🛠️ Technologies utilisées
- **NestJS** – Backend & architecture applicative
- **EJS** – Moteur de templates pour l’interface web
- **Puppeteer** – Automatisation des actions sur OneHR
- **MySQL** – Base de données

---

## 🚀 Installation

### Prérequis
- Node.js (v16 ou plus recommandé)
- npm ou yarn
- MySQL
- Google Chrome / Chromium (pour Puppeteer)

### Étapes d’installation
```bash
# Cloner le projet
git clone <repository-url>

# Accéder au dossier
cd admin-one

# Installer les dépendances
npm install

# Configurer les variables d’environnement
cp .env.example .env

# Lancer l’application en mode développement
npm run start:dev
````

> 💡 **Conseils NestJS**
>
> * Utiliser `npm run build` pour la production
> * Vérifier les permissions MySQL et le charset (`utf8mb4`)
> * Installer Chrome manuellement sur le serveur si Puppeteer pose problème

---

## 🧑‍💻 Utilisation

* Accéder à l’application via un navigateur web
* Interface d’administration pour les équipes RH
* Une partie **API** est disponible pour la communication avec l’application mobile des employés

> ⚠️ Les endpoints API ne sont pas documentés publiquement (projet interne)

---

## 🔐 Configuration

Exemple de fichier `.env` :

```env
INACTIVITY_TIMEOUT=5000
# HEADLESS=false

# Configuration MySQL
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=onehr

# Configuration email
EMAIL_ADRESS=user@aquarabe.mg
EMAIL_PASSWORD=MyUserPassword1234

# Compte administrateur par défaut
ADMIN_DEFAULT_LOGIN=admin@aquarabe.mg
ADMIN_DEFAULT_PASSWORD=MyAdminPassword1234
```

⚠️ **Important**

* Ne jamais versionner le fichier `.env`
* Modifier les identifiants en environnement de production

---

## 🧪 Tests

Aucun test automatisé n’est disponible pour le moment.

---

## 📦 Statut du projet

🚧 **En cours de développement**

---

## 🏢 Licence & usage

Projet **interne**, destiné exclusivement à l’entreprise **Aquarelle**.
Aucune licence open-source.

---

## ✍️ Auteur

**RAHASINIAINA Aristod Davidson**