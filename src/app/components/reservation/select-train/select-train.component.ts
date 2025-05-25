import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Pour ngModel si besoin pour les filtres/tris
import { TrainService } from '../../../services/train.service';
import { ReservationService } from '../../../services/reservation.service';
import { Train, TrainSearchCriteria, PassengerCategory, Station } from '../../../models/train.model';
// import { Station } from '../../../models/station.model'; // Station n'est pas directement utilisé ici

// OpenLayers imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import LineString from 'ol/geom/LineString';

@Component({
  selector: 'app-select-train',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './select-train.component.html',
  styleUrl: './select-train.component.scss'
})
export class SelectTrainComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement!: ElementRef; // Pour cibler le div de la carte
  map!: Map;

  searchCriteria!: TrainSearchCriteria;
  availableTrains: Train[] = [];
  filteredTrains: Train[] = [];
  isLoading = true;
  errorLoading = false;

  // Options de tri
  sortOptions = [
    { value: 'departureTime', label: 'Heure de départ' },
    { value: 'duration', label: 'Durée du trajet' },
    { value: 'price', label: 'Prix' }
  ];
  currentSort: keyof Train | 'departureTime' | 'duration' | 'price' = 'departureTime';


  // Options de filtre (exemple)
  trainTypes: string[] = ['TGV', 'Intercités', 'TER']; // À peupler dynamiquement ou mocké
  selectedTrainTypes: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public trainService: TrainService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    const criteria = this.reservationService.getSearchCriteria();
    if (criteria) {
      this.searchCriteria = criteria;
      this.loadAvailableTrains(); // Cela chargera les trains et ensuite la carte via ngAfterViewInit ou une chaîne d'appels
    } else {
      // Si aucun critère n'est trouvé dans le service, rediriger vers la recherche
      console.warn('Search criteria not found in ReservationService, redirecting to search.');
      this.router.navigate(['/search']);
    }
  }

  ngAfterViewInit(): void {
    // Initialiser la carte seulement après que la vue (et mapElement) soit initialisée
    // et que les critères de recherche (donc les gares de départ/arrivée) soient connus.
    if (this.searchCriteria && this.mapElement) {
        this.initMap();
    }
  }

  initMap(): void {
    if (!this.searchCriteria || !this.mapElement || !this.mapElement.nativeElement) {
        console.error('Map initialization failed: search criteria or map element not ready.');
        return;
    }

    const gabonCenter = fromLonLat([11.8, 0.5]); // Coordonnées approx. pour centrer sur le Gabon
    const stations = this.trainService.getAllStations();
    const stationFeatures: Feature<Point>[] = [];

    const departureStation = stations.find(s => s.name === this.searchCriteria.departureLocation);
    const arrivalStation = stations.find(s => s.name === this.searchCriteria.arrivalLocation);

    stations.forEach(station => {
      if (station.longitude != null && station.latitude != null) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([station.longitude, station.latitude])),
          name: station.name,
          city: station.city
        });

        let iconSrc = 'assets/icons/marker-default.png'; // Icône par défaut
        let iconScale = 0.08;
        if (station.name === departureStation?.name) {
            iconSrc = 'assets/icons/marker-departure.png'; // Icône spécifique départ
            iconScale = 0.1;
        } else if (station.name === arrivalStation?.name) {
            iconSrc = 'assets/icons/marker-arrival.png'; // Icône spécifique arrivée
            iconScale = 0.1;
        }

        feature.setStyle(new Style({
          image: new Icon({
            anchor: [0.5, 1], // Ancrer à la base du milieu de l'icône
            src: iconSrc,
            scale: iconScale,
          })
        }));
        stationFeatures.push(feature);
      }
    });

    const vectorSource = new VectorSource({
      features: stationFeatures
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    
    // Création d'une ligne entre départ et arrivée (simplifiée)
    let routeLineLayer = new VectorLayer({}); // Initialiser vide
    if (departureStation?.longitude && departureStation?.latitude && arrivalStation?.longitude && arrivalStation?.latitude) {
        const routeCoordinates = [
            fromLonLat([departureStation.longitude, departureStation.latitude]),
            fromLonLat([arrivalStation.longitude, arrivalStation.latitude])
        ];
        const routeLine = new Feature({
            geometry: new LineString(routeCoordinates)
        });
        routeLine.setStyle(new Style({
            stroke: new Stroke({
                color: '#3F51B5', // Couleur principale
                width: 3
            })
        }));
        const routeSource = new VectorSource({ features: [routeLine] });
        routeLineLayer = new VectorLayer({ source: routeSource });
    }

    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer,
        routeLineLayer // Ajouter la couche de la ligne
      ],
      view: new View({
        center: gabonCenter,
        zoom: 6.5, // Zoom initial
        minZoom: 5,
        maxZoom: 12
      })
    });
    
    // Ajuster la vue pour inclure les marqueurs de départ et d'arrivée si possible
    if (departureStation?.longitude && departureStation?.latitude && arrivalStation?.longitude && arrivalStation?.latitude) {
        const extent = new VectorSource({ features: stationFeatures.filter(f => 
            f.get('name') === departureStation.name || f.get('name') === arrivalStation.name
        ) }).getExtent();
        if (extent && extent.every(isFinite)){
             this.map.getView().fit(extent, { padding: [100, 100, 100, 100], maxZoom: 10, duration: 1000 });
        }
    } else if (departureStation?.longitude && departureStation?.latitude) {
        // Centrer sur la gare de départ si seulement elle est définie
        this.map.getView().animate({ center: fromLonLat([departureStation.longitude, departureStation.latitude]), zoom: 8, duration: 1000 });
    }

  }

  loadAvailableTrains(): void {
    this.isLoading = true;
    this.errorLoading = false;
    console.log('Critères de recherche AVANT appel service:', JSON.stringify(this.searchCriteria)); // Log des critères
    this.trainService.searchTrains(
      this.searchCriteria.departureLocation,
      this.searchCriteria.arrivalLocation,
      this.searchCriteria.departureDate,
      this.searchCriteria.passengerCount,
      this.searchCriteria.passengerCategory
    ).subscribe({
      next: (trains) => {
        console.log('Trains reçus du service:', trains);
        this.availableTrains = trains.map(train => ({
          ...train,
          durationInMinutes: this.parseDurationToMinutes(train.duration)
        }));
        console.log('Available trains mappés:', this.availableTrains);
        this.filteredTrains = [...this.availableTrains];
        this.populateTrainTypesFilter();
        this.applyFiltersAndSort();
        console.log('Filtered trains après filtres initiaux:', this.filteredTrains);
        this.isLoading = false;
        // Si la carte n'est pas encore initialisée et que la vue est prête
        if (!this.map && this.mapElement && this.searchCriteria) {
            this.initMap();
        }
      },
      error: (err) => {
        console.error('Error loading trains:', err);
        this.isLoading = false;
        this.errorLoading = true;
      }
    });
  }
  
  parseDurationToMinutes(duration: string): number {
    const parts = duration.match(/(\d+)h(?:(\d+)min)?/);
    if (!parts) return Infinity; // Gérer les formats incorrects

    const hours = parseInt(parts[1], 10) || 0;
    const minutes = parseInt(parts[2], 10) || 0;
    return hours * 60 + minutes;
  }


  populateTrainTypesFilter(): void {
    const types = new Set(this.availableTrains.map(train => train.trainType));
    this.trainTypes = Array.from(types);
    console.log('Train types pour filtres:', this.trainTypes);
    this.trainTypes.forEach(type => this.selectedTrainTypes[type] = true);
    console.log('Selected train types (initial):', this.selectedTrainTypes);
  }

  applyFiltersAndSort(): void {
    console.log('Application des filtres et du tri...');
    console.log('Types de train sélectionnés avant filtrage:', this.selectedTrainTypes);
    // Filtrage
    let tempTrains = this.availableTrains.filter(train => {
      return this.selectedTrainTypes[train.trainType];
    });

    // Tri
    tempTrains.sort((a, b) => {
      switch (this.currentSort) {
        case 'departureTime':
          // Comparer les heures (ex: "09:00" vs "11:30")
          return (a.departureTime || '').localeCompare(b.departureTime || '');
        case 'duration':
          return (a.durationInMinutes || Infinity) - (b.durationInMinutes || Infinity);
        case 'price':
          return (a.basePrice || Infinity) - (b.basePrice || Infinity);
        default:
          return 0;
      }
    });
    console.log('Trains après filtrage, avant tri:', tempTrains);
    this.filteredTrains = tempTrains;
    console.log('Trains finaux après tri:', this.filteredTrains);
  }
  
  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentSort = selectElement.value as keyof Train | 'departureTime' | 'duration' | 'price';
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  selectTrainAndProceed(train: Train): void {
    this.isLoading = true; // Peut-être un indicateur spécifique pour cette action
    this.errorLoading = false; // Réinitialiser l'erreur

    this.reservationService.selectTrain(train).subscribe({
      next: (partialReservation) => {
        this.isLoading = false;
        if (partialReservation) {
          this.router.navigate(['/passenger-details']);
        } else {
          // Gérer le cas où la réservation partielle n'est pas créée (ne devrait pas arriver si selectTrain réussit)
          this.errorLoading = true; // Ou un message d'erreur plus spécifique
          console.error('Failed to initialize partial reservation after selecting train.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorLoading = true; // Ou un message d'erreur plus spécifique
        console.error('Error selecting train and proceeding:', err);
        // Afficher un message à l'utilisateur ici
      }
    });
  }
}
