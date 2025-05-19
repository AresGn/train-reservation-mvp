# Readme: Projet de Réservation de Train (MVP Frontend)

## Aperçu du Projet

Ce projet MVP est une application de réservation de billets de train avec une interface utilisateur intuitive développée avec Angular. Cette version se concentre uniquement sur l'expérience frontend sans implémentation backend, offrant aux utilisateurs la possibilité de s'inscrire, rechercher des trains, sélectionner des itinéraires et simuler le processus de réservation complet.

## Structure de l'Application

L'application est organisée en plusieurs pages avec un flux utilisateur logique:

### 1. Pages d'Authentification

#### 1.1 Page d'Inscription (`/register`)
- Formulaire de création de compte demandant:
  - Nom et prénom
  - Email (avec validation)
  - Mot de passe (avec règles de sécurité)
  - Genre (sélection)
  - Lieu de résidence
  - Âge
  - Nationalité
- Bouton de soumission
- Lien vers la page de connexion

#### 1.2 Page de Connexion (`/login`)
- Formulaire simple avec:
  - Email
  - Mot de passe
- Option "Se souvenir de moi"
- Lien "Mot de passe oublié"
- Bouton de connexion
- Lien vers la page d'inscription

### 2. Flux de Réservation

#### 2.1 Page de Recherche (`/search`)
- Formulaire de recherche avec:
  - Lieu de départ (avec autocomplétion)
  - Lieu d'arrivée (avec autocomplétion)
  - Date du voyage (sélecteur de date)
  - Heure approximative (sélecteur d'heures)
  - Nombre de passagers
- Bouton de recherche

#### 2.2 Page de Sélection du Train (`/select-train`)
- Liste des trains disponibles avec:
  - Heure de départ et d'arrivée
  - Durée du voyage
  - Type de train
  - Prix de base
  - Disponibilité des places
- Options de filtrage (prix, heure, durée)
- Option de tri
- Bouton de sélection pour chaque train

#### 2.3 Page de Détails Passager (`/passenger-details`)
- Formulaire pour chaque passager avec:
  - Nom et prénom (pré-rempli pour l'utilisateur principal)
  - Âge (pour calculer la réduction éventuelle)
  - Type de billet (standard, business, première classe)
  - Numéro de téléphone de contact en cas d'urgence
- Affichage du prix ajusté selon l'âge
- Bouton pour continuer vers le paiement

#### 2.4 Page de Paiement (`/payment`)
- Résumé de la réservation
- Formulaire de paiement avec:
  - Options de méthode de paiement (carte bancaire, PayPal)
  - Champs pour les détails de paiement
  - Case à cocher pour les conditions générales
- Bouton de confirmation du paiement

#### 2.5 Page de Confirmation (`/confirmation`)
- Confirmation de réservation réussie
- Détails du billet
- Numéro de référence de la réservation
- Options pour:
  - Télécharger le billet (PDF)
  - Envoyer par email
  - Ajouter au calendrier

### 3. Composants Partagés

#### 3.1 Header (`header` component)
- Logo de l'application
- Menu de navigation
- Bouton de connexion/déconnexion
- Accès rapide au profil utilisateur

#### 3.2 Footer (`footer` component)
- Liens d'informations (À propos, Contact, FAQ)
- Mentions légales
- Informations de copyright
- Liens vers les réseaux sociaux

## Spécifications UI/UX

### Palette de Couleurs
- Couleur principale: #3F51B5 (bleu indigo)
- Couleur secondaire: #FF4081 (rose)
- Couleurs neutres: #F5F5F5 (gris clair), #FFFFFF (blanc), #212121 (gris foncé)
- Couleurs d'accentuation: #4CAF50 (vert pour les succès), #F44336 (rouge pour les erreurs)

### Typographie
- Police principale: Roboto
- Titres: Roboto Medium, 24px/20px/18px
- Corps du texte: Roboto Regular, 16px
- Texte secondaire: Roboto Light, 14px

### Éléments d'Interface

#### Formulaires
- Champs texte avec validation en temps réel
- Messages d'erreur clairs sous chaque champ
- Mise en évidence des champs obligatoires
- Autocomplétion pour les destinations

#### Boutons
- Boutons primaires: fond coloré, arrondis
- Boutons secondaires: contour, transparent
- Boutons désactivés: opacité réduite
- Effet de hover pour tous les boutons

#### Cartes (pour les trains)
- Design avec ombres légères
- Affichage clair des informations clés
- Indicateur visuel de disponibilité
- Effet de survol pour indiquer la sélectabilité

#### Notifications
- Toasts pour les actions réussies/échouées
- Messages de confirmation pour les étapes importantes
- Indicateurs de chargement lors des transitions

### Adaptabilité et Responsive Design
- Design adaptatif pour desktop, tablette et mobile
- Adaptation de la mise en page pour les petits écrans
- Menus hamburger sur mobile
- Formulaires repensés pour l'affichage vertical

## Prototypage et Wireframes

Pour chaque page principale, des wireframes simples doivent être créés avant l'implémentation :

1. Page d'accueil/recherche
2. Résultats de recherche/sélection du train
3. Détails des passagers
4. Page de paiement
5. Page de confirmation

## Comportements Clés

### Navigation
- Flux linéaire guidé entre les étapes de réservation
- Possibilité de revenir en arrière sans perdre les données
- Gestion du panier temporaire pendant la session
- Redirection vers la connexion si nécessaire

### Validation
- Validation des formulaires en temps réel
- Messages d'erreur contextuels
- Prévention contre la soumission de formulaires incomplets
- Validation des dates (pas de réservations dans le passé)

### Simulation de Backend
- Utilisation de données mockées pour simuler les réponses API
- Stockage des données utilisateur en localStorage
- Simulation de temps de chargement réalistes
- Gestion des erreurs potentielles

## Livrables Attendus

1. Pages Angular complètes selon la structure définie
2. Composants UI réutilisables
3. Formulaires validés et fonctionnels
4. Navigation fluide entre les pages
5. Design responsive adapté à tous les appareils
6. Données mockées pour simuler les interactions backend
7. Documentation des composants et services

## Futures Évolutions (Post-MVP)

1. Intégration backend réelle avec API
2. Système de gestion des comptes utilisateurs
3. Historique des réservations
4. Système de notifications par email/SMS
5. Fonctionnalités sociales (partage de voyage)
6. Localisation et support multilingue
7. Mode hors-ligne avec Progressive Web App

## Installation et Démarrage

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]
cd train-reservation-app

# Installer les dépendances
npm install

# Lancer l'application en mode développement
ng serve --open
```

L'application sera accessible à l'adresse http://localhost:4200/.

## Remarques de Développement

- Utiliser les principes de l'architecture Angular (composants, services, modules)
- Implémenter des gardes de routes pour protéger certaines pages
- Utiliser les formulaires réactifs d'Angular pour tous les formulaires
- Intégrer Material Design pour les composants UI
- Utiliser SCSS pour les styles personnalisés
- Tester l'application sur différents appareils et navigateurs

---

Ce guide de développement servira de référence pour implémenter un MVP fonctionnel et visuellement attractif pour l'application de réservation de train, en se concentrant uniquement sur l'aspect frontend.


# Readme: Projet de Réservation de Train au Gabon (MVP Frontend)

## Aperçu du Projet

Ce projet MVP est une application de réservation de billets de train au Gabon avec une interface utilisateur intuitive développée avec Angular. Cette version se concentre uniquement sur l'expérience frontend sans implémentation backend, offrant aux utilisateurs la possibilité de s'inscrire, rechercher des trains sur le réseau ferroviaire gabonais (ligne Owendo-Franceville), sélectionner des itinéraires et simuler le processus de réservation complet.

## Contexte

Cette application est spécifiquement conçue pour le réseau ferroviaire du Gabon, permettant aux utilisateurs de réserver des billets de train entre Owendo (Libreville) et Franceville, en passant par différentes gares intermédiaires. L'application sera développée prioritairement pour Android, avec une version compatible PC.

## Structure de l'Application

L'application est organisée en plusieurs pages avec un flux utilisateur logique:

### 1. Pages d'Authentification

#### 1.1 Page d'Inscription (`/register`)
- Formulaire de création de compte demandant:
  - Nom et prénom
  - Email (avec validation)
  - Mot de passe (avec règles de sécurité)
  - Genre (sélection)
  - Lieu de résidence
  - Âge
  - Nationalité
- Bouton de soumission
- Lien vers la page de connexion

#### 1.2 Page de Connexion (`/login`)
- Formulaire simple avec:
  - Email
  - Mot de passe
- Option "Se souvenir de moi"
- Lien "Mot de passe oublié"
- Bouton de connexion
- Lien vers la page d'inscription

### 2. Flux de Réservation

#### 2.1 Page de Recherche (`/search`)
- Formulaire de recherche avec:
  - Lieu de départ (sélection parmi les gares gabonaises)
  - Lieu d'arrivée (sélection parmi les gares gabonaises)
  - Date du voyage (sélecteur de date)
  - Heure approximative (sélecteur d'heures)
  - Nombre de passagers
  - Catégorie de passager (standard, étudiant, 3ème âge)
- Bouton de recherche

#### 2.2 Page de Sélection du Train (`/select-train`)
- Liste des trains disponibles avec:
  - Heure de départ et d'arrivée
  - Durée du voyage
  - Type de train
  - Prix (calculé selon la distance et la catégorie de passager)
  - Disponibilité des places
- Options de filtrage (prix, heure, durée)
- Option de tri
- Bouton de sélection pour chaque train
- Affichage des réductions applicables (étudiant: 30%, 3ème âge: 35%)

#### 2.3 Page de Détails Passager (`/passenger-details`)
- Formulaire pour chaque passager avec:
  - Nom et prénom (pré-rempli pour l'utilisateur principal)
  - Âge (pour calculer la réduction éventuelle)
  - Statut (standard, étudiant, 3ème âge)
  - Type de billet (standard, business, première classe)
  - Numéro de téléphone de contact en cas d'urgence
- Affichage du prix ajusté selon le statut (réductions appliquées)
- Bouton pour continuer vers le paiement

#### 2.4 Page de Paiement (`/payment`)
- Résumé de la réservation
- Formulaire de paiement avec:
  - Options de méthode de paiement (carte bancaire, mobile money)
  - Champs pour les détails de paiement
  - Case à cocher pour les conditions générales
- Bouton de confirmation du paiement
- Affichage du prix en FCFA

#### 2.5 Page de Confirmation (`/confirmation`)
- Confirmation de réservation réussie
- Détails du billet
- Numéro de référence de la réservation
- Plan de voyage avec les gares de départ et d'arrivée
- Options pour:
  - Télécharger le billet (PDF)
  - Envoyer par email
  - Ajouter au calendrier

### 3. Composants Partagés

#### 3.1 Header (`header` component)
- Logo de l'application
- Menu de navigation
- Bouton de connexion/déconnexion
- Accès rapide au profil utilisateur

#### 3.2 Footer (`footer` component)
- Liens d'informations (À propos, Contact, FAQ)
- Mentions légales
- Informations de copyright
- Liens vers les réseaux sociaux

## Détails Spécifiques au Gabon

### Réseau Ferroviaire
L'application intègre toutes les gares du réseau ferroviaire gabonais:
- **Gares principales**: Owendo (Libreville), Ndjolé, Lopé, Booué, Lastourville, Moanda, Franceville
- **Gares intermédiaires**: N'toum, Andeme, M'Bel, Oyan, Abanga, Alembé, Otoumbi, Bissouna, Ayem, Offoué, Ivindo, Mayabi, Milolé, Doumé, Lifouta, Mboungou-Mbadouma

### Tarification
- Prix standard Owendo-Franceville: 35000 FCFA
- Réduction pour étudiants: 30%
- Réduction pour personnes du 3ème âge: 35%
- Tarifs proportionnels pour les trajets intermédiaires (calculés selon la distance)

## Spécifications UI/UX

### Palette de Couleurs
- Couleur principale: #3F51B5 (bleu indigo)
- Couleur secondaire: #FF4081 (rose)
- Couleurs neutres: #F5F5F5 (gris clair), #FFFFFF (blanc), #212121 (gris foncé)
- Couleurs d'accentuation: #4CAF50 (vert pour les succès), #F44336 (rouge pour les erreurs)
- Utilisation de couleurs nationales gabonaises pour les accents (vert, jaune, bleu)

### Typographie
- Police principale: Roboto
- Titres: Roboto Medium, 24px/20px/18px
- Corps du texte: Roboto Regular, 16px
- Texte secondaire: Roboto Light, 14px

### Éléments d'Interface

#### Formulaires
- Champs texte avec validation en temps réel
- Messages d'erreur clairs sous chaque champ
- Mise en évidence des champs obligatoires
- Sélecteurs prédéfinis pour les gares ferroviaires gabonaises

#### Boutons
- Boutons primaires: fond coloré, arrondis
- Boutons secondaires: contour, transparent
- Boutons désactivés: opacité réduite
- Effet de hover pour tous les boutons

#### Cartes (pour les trains)
- Design avec ombres légères
- Affichage clair des informations clés
- Indicateur visuel de disponibilité
- Effet de survol pour indiquer la sélectabilité
- Affichage des tarifs réduits lorsqu'applicable

#### Notifications
- Toasts pour les actions réussies/échouées
- Messages de confirmation pour les étapes importantes
- Indicateurs de chargement lors des transitions

### Adaptabilité et Responsive Design
- Design adaptatif prioritairement conçu pour Android
- Version compatible PC également développée
- Adaptation de la mise en page pour les petits écrans
- Menus hamburger sur mobile
- Formulaires repensés pour l'affichage vertical

## Carte Interactive du Réseau

- Visualisation interactive du réseau ferroviaire gabonais
- Affichage des gares principales et intermédiaires
- Possibilité de sélectionner les gares de départ et d'arrivée sur la carte
- Affichage des distances et temps de trajet estimés
- Indication des prix selon le trajet sélectionné

## Prototypage et Wireframes

Pour chaque page principale, des wireframes simples doivent être créés avant l'implémentation :

1. Page d'accueil/recherche
2. Résultats de recherche/sélection du train
3. Détails des passagers
4. Page de paiement
5. Page de confirmation
6. Carte du réseau ferroviaire

## Comportements Clés

### Navigation
- Flux linéaire guidé entre les étapes de réservation
- Possibilité de revenir en arrière sans perdre les données
- Gestion du panier temporaire pendant la session
- Redirection vers la connexion si nécessaire

### Validation
- Validation des formulaires en temps réel
- Messages d'erreur contextuels
- Prévention contre la soumission de formulaires incomplets
- Validation des dates (pas de réservations dans le passé)

### Calcul des Prix
- Calcul automatique des prix selon:
  - Distance entre les gares (trajet complet ou partiel)
  - Catégorie de passager (standard, étudiant, 3ème âge)
  - Application des réductions appropriées
- Affichage des détails du calcul pour transparence

### Simulation de Backend
- Utilisation de données mockées pour simuler les réponses API
- Stockage des données utilisateur en localStorage
- Simulation de temps de chargement réalistes
- Gestion des erreurs potentielles

## Livrables Attendus

1. Pages Angular complètes selon la structure définie
2. Composants UI réutilisables
3. Formulaires validés et fonctionnels
4. Navigation fluide entre les pages
5. Design responsive adapté aux appareils Android et PC
6. Données mockées pour simuler les interactions backend
7. Documentation des composants et services
8. APK pour installation sur Android

## Futures Évolutions (Post-MVP)

1. Intégration backend réelle avec API
2. Système de gestion des comptes utilisateurs
3. Historique des réservations
4. Système de notifications par email/SMS
5. Fonctionnalités sociales (partage de voyage)
6. Localisation et support multilingue (français, langues locales)
7. Mode hors-ligne avec Progressive Web App
8. Intégration des systèmes de paiement locaux

## Installation et Démarrage

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]
cd train-reservation-app

# Installer les dépendances
npm install

# Lancer l'application en mode développement
ng serve --open
```

L'application sera accessible à l'adresse http://localhost:4200/.

## Remarques de Développement

- Utiliser les principes de l'architecture Angular (composants, services, modules)
- Implémenter des gardes de routes pour protéger certaines pages
- Utiliser les formulaires réactifs d'Angular pour tous les formulaires
- Intégrer Material Design pour les composants UI
- Utiliser SCSS pour les styles personnalisés
- Tester l'application sur différents appareils Android et navigateurs PC
- Utiliser Cordova/Capacitor pour générer l'APK Android

---

Ce guide de développement servira de référence pour implémenter un MVP fonctionnel et visuellement attractif pour l'application de réservation de train spécifique au réseau ferroviaire gabonais, en se concentrant uniquement sur l'aspect frontend.