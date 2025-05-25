import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.css'],
})
export class SearchFiltersComponent {
  @Input() showFavoritesButton = true;
  @Output() filtersChanged = new EventEmitter<any>();
  @Output() shinyToggle = new EventEmitter<boolean>();

  searchTerm = '';
  selectedType = '';
  selectedGeneration = '';
  isShinyMode = false;

  types = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];

  generations = [
    { value: 'generation-i', label: 'Generación I' },
    { value: 'generation-ii', label: 'Generación II' },
    { value: 'generation-iii', label: 'Generación III' },
    { value: 'generation-iv', label: 'Generación IV' },
    { value: 'generation-v', label: 'Generación V' },
    { value: 'generation-vi', label: 'Generación VI' },
    { value: 'generation-vii', label: 'Generación VII' },
    { value: 'generation-viii', label: 'Generación VIII' },
    { value: 'generation-ix', label: 'Generación IX' },
  ];

  constructor(private router: Router) {}

  onSearchChange(): void {
    this.emitFilters();
  }

  onTypeChange(): void {
    this.emitFilters();
  }

  onGenerationChange(): void {
    this.emitFilters();
  }

  toggleShiny(): void {
    this.isShinyMode = !this.isShinyMode;
    this.shinyToggle.emit(this.isShinyMode);
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }

  private emitFilters(): void {
    this.filtersChanged.emit({
      search: this.searchTerm,
      type: this.selectedType,
      generation: this.selectedGeneration,
    });
  }
}
