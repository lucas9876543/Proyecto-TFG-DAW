import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonModalComponent } from '../../components/pokemon-modal/pokemon-modal.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import type { Pokemon } from '../../models/pokemon.model';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchFiltersComponent,
    PokemonCardComponent,
    PokemonModalComponent,
    UserMenuComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pokemon: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  loading = true;
  selectedPokemon: Pokemon | null = null;
  showModal = false;
  isShinyMode = false;

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPokemon();
  }

  async loadPokemon() {
    try {
      // Load first 151 Pokemon for better performance
      const requests = [];
      for (let i = 1; i <= 151; i++) {
        requests.push(this.pokemonService.getPokemon(i).toPromise());
      }

      const pokemon = await Promise.all(requests);
      this.pokemon = pokemon as Pokemon[];
      this.filteredPokemon = pokemon as Pokemon[];
      this.loading = false;
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      this.loading = false;
    }
  }

  onFiltersChanged(filters: any) {
    this.filteredPokemon = this.pokemon.filter((p) => {
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
}
