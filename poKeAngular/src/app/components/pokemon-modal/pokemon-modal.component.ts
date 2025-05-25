import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import type { Pokemon } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-pokemon-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-modal.component.html',
  styleUrls: ['./pokemon-modal.component.css'],
})
export class PokemonModalComponent implements OnInit, OnDestroy {
  @Input() pokemon!: Pokemon;
  @Input() isShiny = false;
  @Output() close = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<number>();

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  get pokemonImage(): string {
    if (this.isShiny) {
      return (
        this.pokemon.sprites.other['official-artwork'].front_shiny ||
        this.pokemon.sprites.front_shiny
      );
    }
    return (
      this.pokemon.sprites.other['official-artwork'].front_default ||
      this.pokemon.sprites.front_default
    );
  }

  get typeColors(): any {
    const types = this.pokemon.types.map((t) => t.type.name);
    if (types.length === 1) {
      return { '--type1-color': this.getTypeColor(types[0]) };
    } else {
      return {
        '--type1-color': this.getTypeColor(types[0]),
        '--type2-color': this.getTypeColor(types[1]),
      };
    }
  }

  get dataTypes(): string {
    return this.pokemon.types.map((t) => t.type.name).join(',');
  }

  get pokemonIdFormatted(): string {
    return this.pokemon.id.toString().padStart(3, '0');
  }

  get pokemonHeight(): number {
    return this.pokemon.height / 10;
  }

  get pokemonWeight(): number {
    return this.pokemon.weight / 10;
  }

  get hasMultipleTypes(): boolean {
    return this.pokemon.types.length > 1;
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.pokemon.id);
  }

  toggleFavorite(): void {
    this.favoritesService.toggleFavorite(this.pokemon.id);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onPrevious(): void {
    if (this.pokemon.id > 1) {
      this.navigate.emit(this.pokemon.id - 1);
    }
  }

  onNext(): void {
    this.navigate.emit(this.pokemon.id + 1);
  }

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      hp: 'HP',
      attack: 'ATK',
      defense: 'DEF',
      'special-attack': 'SP.ATK',
      'special-defense': 'SP.DEF',
      speed: 'SPD',
    };
    return statNames[statName] || statName.toUpperCase();
  }

  getStatPercentage(baseStat: number): number {
    return (baseStat / 255) * 100;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    } else if (event.key === 'ArrowLeft') {
      this.onPrevious();
    } else if (event.key === 'ArrowRight') {
      this.onNext();
    }
  }

  private getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      fire: '#f87524',
      water: '#4d96ff',
      grass: '#6bcb77',
      electric: '#ffd93d',
      ground: '#e4a444',
      rock: '#a38c21',
      fairy: '#ff9f9f',
      poison: '#9f5f80',
      bug: '#9bbf30',
      dragon: '#6f35fc',
      psychic: '#ff6b9e',
      flying: '#a890f0',
      fighting: '#c03028',
      normal: '#a8a878',
      ghost: '#705898',
      ice: '#98d8d8',
      steel: '#b8b8d0',
      dark: '#705848',
    };
    return typeColors[type] || '#a8a878';
  }
}
