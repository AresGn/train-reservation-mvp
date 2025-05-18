# Plan de Séparation des Responsabilités pour le Projet Train Reservation MVP

## Répartition des Tâches entre Arès et Joumas

Pour éviter les conflits lors des pull requests sur GitHub, voici une séparation claire des responsabilités, fichiers et fonctionnalités pour chaque développeur.

### Responsabilités d'Arès

#### Dossiers et Fichiers
- `src/app/components/auth/` (dossier complet)
- `src/app/components/shared/header/`
- `src/app/components/reservation/search/`
- `src/app/components/reservation/select-train/`
- `src/app/services/auth.service.ts`
- `src/assets/styles/auth-styles/` (si nécessaire pour les styles spécifiques)
- `src/app/models/user.model.ts`
- `src/app/models/train.model.ts`

#### Fonctionnalités
1. **Système d'Authentification**
   - Page d'inscription
   - Page de connexion
   - Gestion des profils utilisateurs
   - Validation des formulaires d'authentification

2. **Recherche et Sélection de Train**
   - Interface de recherche
   - Affichage des résultats de train
   - Filtres et tris des options de train
   - Sélection d'un train

3. **Header et Navigation**
   - Menu de navigation principal
   - État de connexion/déconnexion
   - Navigation entre sections

#### Routes à Configurer
- `/register`
- `/login`
- `/search`
- `/select-train`

### Responsabilités de Joumas

#### Dossiers et Fichiers
- `src/app/components/reservation/passenger-details/`
- `src/app/components/reservation/payment/`
- `src/app/components/reservation/confirmation/`
- `src/app/components/shared/footer/`
- `src/app/services/reservation.service.ts`
- `src/app/services/payment.service.ts`
- `src/assets/styles/reservation-styles/` (si nécessaire pour les styles spécifiques)
- `src/app/models/reservation.model.ts`
- `src/app/models/payment.model.ts`

#### Fonctionnalités
1. **Gestion des Détails de Réservation**
   - Formulaire de détails passagers
   - Calcul des prix selon l'âge
   - Saisie des contacts d'urgence

2. **Système de Paiement**
   - Interface de paiement
   - Validation des formulaires de paiement
   - Simulation de transactions

3. **Confirmation et Billets**
   - Page de confirmation
   - Génération de billets PDF (simulation)
   - Options de partage

4. **Footer et Informations Supplémentaires**
   - Liens d'information
   - Mentions légales
   - Support et contact

#### Routes à Configurer
- `/passenger-details`
- `/payment`
- `/confirmation`

## Fichiers Partagés et Coordination

### Fichiers nécessitant coordination
- `src/app/app-routing.module.ts` (routes principales)
- `src/app/app.module.ts` (imports des modules)
- `src/styles.scss` (styles globaux)
- `angular.json` (si modifications de configuration)

**Processus de Modification des Fichiers Partagés:**
1. Communiquer les changements nécessaires via un canal dédié
2. Désigner une personne responsable pour effectuer les modifications
3. Effectuer une review collective avant merge

## Structure de Données Partagées

Pour assurer la cohérence entre les différentes parties, les modèles de données communs doivent respecter ces interfaces:

```typescript
// Exemple de structure de données partagée
interface Reservation {
  id: string;
  userId: string;
  trainId: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  departureTime: string;
  passengers: Passenger[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Passenger {
  name: string;
  age: number;
  ticketType: 'standard' | 'business' | 'first';
  emergencyContact?: string;
  price: number;
}
```

## Workflow GitHub

### Branches
- `main` : Branche principale protégée
- `develop` : Branche de développement intégrée
- `feature/auth/*` : Branches pour les fonctionnalités d'Arès
- `feature/reservation/*` : Branches pour les fonctionnalités de Joumas

### Processus de Pull Request
1. Créer une branche depuis `develop` avec le préfixe approprié
2. Développer la fonctionnalité
3. Pousser la branche et créer une PR vers `develop`
4. Demander la review du coéquipier
5. Merger après approbation

## Communication et Points de Synchronisation

### Points de Synchronisation Recommandés
1. **Début du projet**: Alignement sur les conventions de code et la structure
2. **Après setup initial**: Validation de l'architecture globale
3. **Interfaces de transfert**: Définir les interfaces entre les sections
4. **Revue UI/UX**: Assurer la cohérence visuelle entre les différentes pages

## Mocks et Données de Test

Pour permettre un développement indépendant, chaque développeur devrait créer et utiliser ses propres données mockées:

- Arès: Utilisateurs et données de trains
- Joumas: Données de réservation et transactions

## Planning de Développement Proposé

### Semaine 1: Setup et Structure de Base
- **Arès**: Structure d'authentification et modèles d'utilisateurs
- **Joumas**: Structure de réservation et modèles de paiement

### Semaine 2: Développement des Interfaces Principales
- **Arès**: Pages d'auth et recherche de trains
- **Joumas**: Pages de détails et paiement

### Semaine 3: Finalisation des Fonctionnalités et Tests
- **Arès**: Affinage de l'UX de recherche et sélection
- **Joumas**: Affinage du processus de paiement et confirmation

### Semaine 4: Intégration et Tests Croisés
- Merge sur `develop`
- Tests d'intégration
- Corrections de bugs
- Préparation de la release

## Tests

Chaque développeur est responsable des tests unitaires de ses composants:

- **Arès**: Tests des services auth et fonctionnalités de recherche
- **Joumas**: Tests des services de réservation et paiement

## Conclusion

Cette séparation claire des responsabilités permettra à Arès et Joumas de travailler en parallèle sans créer de conflits lors des pull requests. La clé du succès sera la communication régulière et le respect des interfaces définies conjointement.