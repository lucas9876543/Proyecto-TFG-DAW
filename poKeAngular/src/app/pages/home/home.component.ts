import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonModalComponent } from '../../components/pokemon-modal/pokemon-modal.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import type { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

// Define a type for generation keys
type GenerationKey =
  | 'generation-i'
  | 'generation-ii'
  | 'generation-iii'
  | 'generation-iv'
  | 'generation-v'
  | 'generation-vi'
  | 'generation-vii'
  | 'generation-viii'
  | 'generation-ix';

// Define a type for the generation range
interface GenerationRange {
  start: number;
  end: number;
}

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
  loadingGeneration = false;
  selectedPokemon: Pokemon | null = null;
  showModal = false;
  isShinyMode = false;
  noMatchingPokemon = false;
  currentGeneration = '';
  generationRanges: Record<GenerationKey, GenerationRange> = {
    'generation-i': { start: 1, end: 151 },
    'generation-ii': { start: 152, end: 251 },
    'generation-iii': { start: 252, end: 386 },
    'generation-iv': { start: 387, end: 493 },
    'generation-v': { start: 494, end: 649 },
    'generation-vi': { start: 650, end: 721 },
    'generation-vii': { start: 722, end: 809 },
    'generation-viii': { start: 810, end: 905 },
    'generation-ix': { start: 906, end: 1010 },
  };
  loadedGenerations = new Set<string>(['generation-i', 'generation-ix']);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemon();
  }

  async loadPokemon() {
    try {
      this.loading = true;
      const requests = [];
      for (let i = 1; i <= 1010; i++) {
        requests.push(
          this.pokemonService.getPokemonWithGeneration(i).toPromise()
        );
      }

      const pokemon = await Promise.all(requests);
      this.pokemon = pokemon as (Pokemon & { generation: string })[];
      this.filteredPokemon = this.pokemon;
      this.loading = false;
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      this.loading = false;
    }
  }

  async loadGenerationPokemon(generation: string) {
    if (this.loadedGenerations.has(generation)) {
      return; // Already loaded
    }

    try {
      this.loadingGeneration = true;

      // Type guard to check if the generation is a valid key
      if (this.isValidGeneration(generation)) {
        const range = this.generationRanges[generation];

        console.log(
          `Loading ${generation} Pokémon (${range.start}-${range.end})...`
        );

        const requests = [];
        for (let i = range.start; i <= range.end; i++) {
          requests.push(
            this.pokemonService.getPokemonWithGeneration(i).toPromise()
          );
        }

        const newPokemon = await Promise.all(requests);
        this.pokemon = [
          ...this.pokemon,
          ...(newPokemon as (Pokemon & { generation: string })[]),
        ];
        this.loadedGenerations.add(generation);

        // Re-apply current filters
        this.onFiltersChanged({
          search: '',
          type: '',
          generation: this.currentGeneration,
        });
      }

      this.loadingGeneration = false;
    } catch (error) {
      console.error(`Error loading ${generation} Pokemon:`, error);
      this.loadingGeneration = false;
    }
  }

  // Type guard function to check if a string is a valid generation key
  isValidGeneration(key: string): key is GenerationKey {
    return key in this.generationRanges;
  }

  async onFiltersChanged(filters: any) {
    console.log('Filters applied:', filters);
    this.currentGeneration = filters.generation;

    // If a generation is selected that hasn't been loaded yet, load it
    if (filters.generation && !this.loadedGenerations.has(filters.generation)) {
      await this.loadGenerationPokemon(filters.generation);
      return; // The filter will be re-applied after loading
    }

    this.filteredPokemon = this.pokemon.filter((p) => {
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
    console.log('Filtered Pokemon count:', this.filteredPokemon.length);
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
    const pokemon = this.pokemon.find((p) => p.id === pokemonId);
    if (pokemon) {
      this.selectedPokemon = pokemon;
    } else {
      // If the Pokemon isn't loaded yet, fetch it
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
}
