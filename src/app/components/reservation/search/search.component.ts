import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TrainService } from '../../../services/train.service';
import { ReservationService, SearchCriteria } from '../../../services/reservation.service';
import { Station, PassengerCategory } from '../../../models/train.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  formSubmitted = false;
  stations: Station[] = [];
  minDate: string;
  maxDate: string;
  Math = Math; // Pour utiliser Math dans le template
  passengerCategories = [
    { value: PassengerCategory.STANDARD, label: 'Standard' },
    { value: PassengerCategory.STUDENT, label: 'Étudiant (-30%)' },
    { value: PassengerCategory.SENIOR, label: '3ème âge (-35%)' }
  ];
  filteredDepartureStations: Station[] = [];
  filteredArrivalStations: Station[] = [];
  previousCriteria: SearchCriteria | null = null;

  constructor(
    private fb: FormBuilder,
    private trainService: TrainService,
    private reservationService: ReservationService,
    private router: Router
  ) {
    // Définir les dates min et max (aujourd'hui et dans 3 mois)
    const today = new Date();
    this.minDate = this.formatDateForInput(today);
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = this.formatDateForInput(maxDate);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStations();
    this.loadPreviousCriteria();
    this.setupStationFiltering();
  }

  initializeForm(): void {
    this.searchForm = this.fb.group({
      departureLocation: ['', Validators.required],
      arrivalLocation: ['', Validators.required],
      departureDate: ['', Validators.required],
      departureTime: [''],
      passengerCount: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      passengerCategory: [PassengerCategory.STANDARD, Validators.required]
    });
  }

  loadStations(): void {
    this.stations = this.trainService.getAllStations();
    this.filteredDepartureStations = [...this.stations];
    this.filteredArrivalStations = [...this.stations];
  }

  loadPreviousCriteria(): void {
    this.reservationService.searchCriteria$.subscribe(criteria => {
      if (criteria) {
        this.previousCriteria = criteria;
        this.searchForm.patchValue({
          departureLocation: criteria.departureLocation,
          arrivalLocation: criteria.arrivalLocation,
          departureDate: this.formatDateForInput(criteria.departureDate),
          departureTime: criteria.departureTime || '',
          passengerCount: criteria.passengerCount,
          passengerCategory: criteria.passengerCategory
        });
      }
    });
  }

  setupStationFiltering(): void {
    // Filtrer les stations de départ en fonction de la saisie
    this.searchForm.get('departureLocation')?.valueChanges.subscribe(value => {
      this.filterDepartureStations(value);
    });

    // Filtrer les stations d'arrivée en fonction de la saisie
    this.searchForm.get('arrivalLocation')?.valueChanges.subscribe(value => {
      this.filterArrivalStations(value);
    });
  }

  filterDepartureStations(value: string): void {
    if (!value) {
      this.filteredDepartureStations = [...this.stations];
      return;
    }
    
    const filterValue = value.toLowerCase();
    this.filteredDepartureStations = this.stations.filter(station => 
      station.name.toLowerCase().includes(filterValue) ||
      station.city.toLowerCase().includes(filterValue)
    );
  }

  filterArrivalStations(value: string): void {
    if (!value) {
      this.filteredArrivalStations = [...this.stations];
      return;
    }
    
    const filterValue = value.toLowerCase();
    this.filteredArrivalStations = this.stations.filter(station => 
      station.name.toLowerCase().includes(filterValue) ||
      station.city.toLowerCase().includes(filterValue)
    );
  }

  onDepartureStationSelect(stationName: string): void {
    this.searchForm.patchValue({ departureLocation: stationName });
  }

  onArrivalStationSelect(stationName: string): void {
    this.searchForm.patchValue({ arrivalLocation: stationName });
  }

  get f() {
    return this.searchForm.controls;
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.searchForm.invalid) {
      return;
    }

    const searchData = this.searchForm.value;
    const searchCriteria: SearchCriteria = {
      departureLocation: searchData.departureLocation,
      arrivalLocation: searchData.arrivalLocation,
      departureDate: new Date(searchData.departureDate),
      departureTime: searchData.departureTime,
      passengerCount: searchData.passengerCount,
      passengerCategory: searchData.passengerCategory
    };

    // Stockage des critères dans le service
    this.reservationService.setSearchCriteria(searchCriteria);
    
    // Navigation vers la page de sélection de train
    this.router.navigate(['/select-train']);
  }

  // Utilitaire pour formater la date pour l'input HTML
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;

    return [year, month, day].join('-');
  }
} 