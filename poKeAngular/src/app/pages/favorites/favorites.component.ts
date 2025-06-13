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
  noMatchingPokemon = false;

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
        this.pokemonService.getPokemonWithGeneration(id).toPromise()
      );

      const pokemon = await Promise.all(requests);
      this.favoritePokemon = pokemon as (Pokemon & { generation: string })[];
      this.filteredPokemon = pokemon as (Pokemon & { generation: string })[];
      this.loading = false;
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.loading = false;
    }
  }

  onFiltersChanged(filters: any) {
    console.log('Filters applied in favorites:', filters);

    this.filteredPokemon = this.favoritePokemon.filter((p) => {
      const pokemonWithGen = p as Pokemon & { generation: string };

      const matchesSearch =
        !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType =
        !filters.type || p.types.some((t) => t.type.name === filters.type);
      const matchesGeneration =
        !filters.generation || pokemonWithGen.generation === filters.generation;

      return matchesSearch && matchesType && matchesGeneration;
    });

    this.noMatchingPokemon = this.filteredPokemon.length === 0;
    console.log(
      'Filtered Favorite Pokemon count:',
      this.filteredPokemon.length
    );
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

  onNavigate(pokemonId: number) {
    // Check if the Pokemon is in favorites
    if (this.favoritesService.isFavorite(pokemonId)) {
      // If it's in favorites, find it in the loaded favorites
      const pokemon = this.favoritePokemon.find((p) => p.id === pokemonId);
      if (pokemon) {
        this.selectedPokemon = pokemon;
      } else {
        // If not loaded yet, fetch it
        this.pokemonService.getPokemonWithGeneration(pokemonId).subscribe(
          (pokemon) => {
            this.selectedPokemon = pokemon;
          },
          (error) => {
            console.error(`Error loading Pokemon #${pokemonId}:`, error);
          }
        );
      }
    } else {
      // If not in favorites, fetch it but don't add to favorites list
      this.pokemonService.getPokemonWithGeneration(pokemonId).subscribe(
        (pokemon) => {
          this.selectedPokemon = pokemon;
        },
        (error) => {
          console.error(`Error loading Pokemon #${pokemonId}:`, error);
        }
      );
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
