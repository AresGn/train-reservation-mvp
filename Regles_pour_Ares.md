# Règles et Lignes Directrices pour Arès - Projet de Réservation de Train

## Aperçu des Responsabilités

Tu es responsable de la première partie du parcours utilisateur, qui comprend:

1. **Pages d'Authentification** (`/login`, `/register`)
2. **Page de Recherche** (`/search`)
3. **Page de Sélection du Train** (`/select-train`)

Le header (navbar) a déjà été complété par toi et le footer est terminé aussi.

## Approche Mobile First - IMPORTANT!

Notre projet suit une approche **Mobile First**. Cela signifie que:

- Tu dois concevoir et développer d'abord pour les écrans mobiles, puis adapter pour les écrans plus grands
- Utilise les media queries pour élargir progressivement le design (pas l'inverse)
- Teste régulièrement sur différentes tailles d'écran (utilise le mode responsive de Chrome DevTools)
- Référence: [Guide de conception Mobile First](https://www.browserstack.com/guide/how-to-implement-mobile-first-design)

## Structure des Fichiers

Voici les dossiers et fichiers dont tu es responsable:

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/                  # À implémenter
│   │   │   └── register/               # À implémenter
│   │   ├── shared/
│   │   │   └── header/                 # Déjà complété ✅
│   │   ├── reservation/
│   │   │   ├── search/                 # À implémenter
│   │   │   └── select-train/           # À implémenter
│   ├── services/
│   │   └── auth.service.ts             # À implémenter
│   ├── models/
│   │   ├── user.model.ts               # À implémenter
│   │   └── train.model.ts              # À implémenter
│   └── assets/
│       └── styles/
│           └── auth-styles/            # Si nécessaire
```

## Design et UI/UX

### Palette de Couleurs
Respecte scrupuleusement cette palette:
- Couleur principale: `#3F51B5` (bleu indigo)
- Couleur secondaire: `#FF4081` (rose)
- Couleurs neutres: `#F5F5F5` (gris clair), `#FFFFFF` (blanc), `#212121` (gris foncé)
- Couleurs d'accentuation: `#4CAF50` (vert pour les succès), `#F44336` (rouge pour les erreurs)

### Typographie
- Police principale: Roboto
- Titres: Roboto Medium, 24px/20px/18px
- Corps du texte: Roboto Regular, 16px
- Texte secondaire: Roboto Light, 14px

### Exigences Spécifiques par Page

#### 1. Pages d'Authentification
##### 1.1 Page d'Inscription (`/register`)
- Formulaire de création de compte avec validation complète
- Affichage clair des règles de sécurité pour le mot de passe
- Gestion des erreurs de validation en temps réel
- Transition fluide vers la page de connexion

##### 1.2 Page de Connexion (`/login`)
- Formulaire simple et efficace
- Option "Se souvenir de moi"
- Gestion des erreurs d'authentification
- Redirection intelligente post-connexion

#### 2. Page de Recherche (`/search`)
- Autocomplétion performante pour les champs de destination
- Sélecteur de date intuitif avec restrictions logiques
- Validation en temps réel des données saisies
- Design responsive adaptant l'interface aux différents écrans

#### 3. Page de Sélection du Train (`/select-train`)
- Affichage clair des options de train disponibles
- Filtres et tris fonctionnels et intuitifs
- Visualisation claire des détails importants (durée, prix, etc.)
- Design de carte avec états visuels clairs (survol, sélection)

## Meilleures Pratiques à Suivre

### Architecture Angular
- Utilise les formulaires réactifs d'Angular
- Implémente des gardes de routes pour protéger les pages
- Sépare clairement la logique métier dans les services
- Utilise les observables et la gestion d'état

### Conventions de Code
- Respecte le style de code établi
- Commente le code complexe
- Utilise des noms de variables et fonctions descriptifs
- Préfixe les composants et services avec un namespace approprié

### Responsive Design
- Utilise les breakpoints standard:
  - Mobile: 0-599px
  - Tablette: 600-959px
  - Desktop: 960px et plus
- Utilise des unités relatives (rem, %, vh/vw) plutôt que des pixels
- Teste sur différents appareils

### Performance
- Évite les calculs complexes dans les templates
- Optimise les images et assets
- Implémente la lazy loading où approprié
- Minimise les appels HTTP (utilise des services avec cache)

## Workflow de Développement

### Branches Git
- Crée tes branches à partir de `develop`
- Utilise le préfixe `feature/auth/*` pour les fonctionnalités d'auth
- Utilise le préfixe `feature/search/*` pour les fonctionnalités de recherche
- Exemple: `feature/auth/login-form`

### Pull Requests
- Fais des PR vers la branche `develop`
- Demande la review de Joumas avant de merger
- Résous tous les conflits avant de finaliser la PR

### Tests
- Écris des tests unitaires pour tes services
- Vérifie la validation des formulaires
- Teste les cas limites et d'erreur

## Données Mockées

Pour permettre un développement indépendant, crée tes propres données de test:

```typescript
// Exemple de données mockées pour les utilisateurs
const MOCK_USERS = [
  {
    id: 'user-123',
    email: 'jean.dupont@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    age: 35,
    gender: 'male',
    residence: 'Paris',
    nationality: 'Française',
  }
];

// Exemple de données mockées pour les trains
const MOCK_TRAINS = [
  {
    id: 'train-456',
    departureLocation: 'Paris',
    arrivalLocation: 'Lyon',
    departureDate: new Date('2023-12-15'),
    departureTime: '09:00',
    arrivalTime: '11:00',
    duration: '2h00',
    trainType: 'TGV',
    basePrice: 55.00,
    availableSeats: 120,
    features: ['WiFi', 'Restaurant', 'Power Outlets']
  }
];
```

## Communication

- Maintiens une communication régulière avec Joumas
- Organise des points de synchronisation hebdomadaires
- Documente les décisions importantes
- Partage les interfaces critiques tôt pour permettre l'alignement

## Deadline et Livrables

- **Semaine 1**: Structure d'authentification et modèles d'utilisateurs
- **Semaine 2**: Pages d'auth et recherche de trains
- **Semaine 3**: Affinage de l'UX de recherche et sélection
- **Semaine 4**: Intégration et tests croisés

## Liens et Ressources Utiles

- [Documentation Angular](https://angular.io/docs)
- [Angular Material](https://material.angular.io/) (recommandé pour les composants UI)
- [Guide de Design Mobile First](https://www.browserstack.com/guide/how-to-implement-mobile-first-design)
- [Principes de Material Design](https://material.io/design/introduction)

---

Ce document servira de guide pour ton travail sur le projet. N'hésite pas à suggérer des améliorations ou à demander des clarifications si nécessaire. 



Absolument ! Voici un résumé de ce qui a été fait et les informations de connexion :
Résumé des modifications récentes :
Refonte des pages de Connexion et d'Inscription :
J'ai amélioré le design des pages /login et /register pour qu'elles soient plus modernes, professionnelles et responsives (adaptées aux mobiles et aux ordinateurs de bureau).
Les formulaires ont été réorganisés pour une meilleure expérience utilisateur.
Les styles (couleurs, polices, espacements, ombres) ont été harmonisés avec la palette de couleurs et les directives typographiques de votre projet.
J'ai amélioré l'apparence des champs de saisie, des messages d'erreur, des cases à cocher et des boutons.
Identifiants de Connexion par Défaut (pour la simulation MVP) :
Pour faciliter les tests et la simulation, j'ai mis en place un système où, si vous utilisez des identifiants spécifiques, vous serez automatiquement connecté.
Ceci a été ajouté dans les fichiers login.component.ts et register.component.ts.
Une méthode mockLogin a été ajoutée au service auth.service.ts pour gérer cette connexion simulée.
Informations de connexion par défaut pour la simulation :
Email : test@example.com
Mot de passe : Password123!
En utilisant ces informations sur la page de connexion ou d'inscription, l'application vous connectera et vous redirigera directement vers la page de recherche (/search).
Maintenant, je vais me concentrer sur l'amélioration du design de la page search.component.html.