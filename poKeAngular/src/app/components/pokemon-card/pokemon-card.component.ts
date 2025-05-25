import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Pokemon } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css'],
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isShiny = false;
  @Output() pokemonClick = new EventEmitter<Pokemon>();

  constructor(private favoritesService: FavoritesService) {}

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

  get typeClasses(): string {
    const types = this.pokemon.types.map((t) => t.type.name);
    return types.join(' ');
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

  get hasMultipleTypes(): boolean {
    return this.pokemon.types.length > 1;
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.pokemon.id);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.pokemon.id);
  }

  onCardClick(): void {
    this.pokemonClick.emit(this.pokemon);
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
