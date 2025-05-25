import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonModalComponent } from '../../components/pokemon-modal/pokemon-modal.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import type { Pokemon } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    SearchFiltersComponent,
    PokemonCardComponent,
    PokemonModalComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoritePokemon: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  loading = true;
  selectedPokemon: Pokemon | null = null;
  showModal = false;
  isShinyMode = false;

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    try {
      const favoriteIds = this.favoritesService.getFavorites();

      if (favoriteIds.length === 0) {
        this.loading = false;
        return;
      }

      const requests = favoriteIds.map((id) =>
        this.pokemonService.getPokemon(id).toPromise()
      );

      const pokemon = await Promise.all(requests);
      this.favoritePokemon = pokemon as Pokemon[];
      this.filteredPokemon = pokemon as Pokemon[];
      this.loading = false;
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.loading = false;
    }
  }

  onFiltersChanged(filters: any) {
    this.filteredPokemon = this.favoritePokemon.filter((p) => {
      const matchesSearch =
        !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType =
        !filters.type || p.types.some((t) => t.type.name === filters.type);

      return matchesSearch && matchesType;
    });
  }

  onShinyToggle(isShiny: boolean) {
    this.isShinyMode = isShiny;
  }

  onPokemonClick(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
    this.showModal = true;
  }

  onModalClose() {
    this.showModal = false;
    this.selectedPokemon = null;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
