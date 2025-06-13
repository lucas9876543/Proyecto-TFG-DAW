import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, forkJoin, map, switchMap } from 'rxjs';
import type { Pokemon, PokemonSpecies } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly API_BASE = 'https://pokeapi.co/api/v2/';
  private readonly POKEMON_LIMIT = 1010;

  constructor(private http: HttpClient) {}

  getAllPokemon(): Observable<Pokemon[]> {
    const requests: Observable<Pokemon>[] = [];

    for (let i = 1; i <= this.POKEMON_LIMIT; i++) {
      requests.push(this.getPokemon(i));
    }

    return forkJoin(requests);
  }

  getPokemon(id: number | string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_BASE}pokemon/${id}`);
  }

  getPokemonSpecies(id: number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(
      `${this.API_BASE}pokemon-species/${id}`
    );
  }

  getPokemonWithGeneration(
    id: number
  ): Observable<Pokemon & { generation: string }> {
    return this.getPokemon(id).pipe(
      switchMap((pokemon) =>
        this.getPokemonSpecies(id).pipe(
          map((species) => ({
            ...pokemon,
            generation: species.generation.name,
          }))
        )
      )
    );
  }

  searchPokemon(query: string): Observable<Pokemon[]> {
    if (!query.trim()) {
      return this.getAllPokemon();
    }

    return this.getAllPokemon().pipe(
      map((pokemon) =>
        pokemon.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  getTypes(): string[] {
    return [
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
  }

  getGenerations(): string[] {
    return [
      'generation-i',
      'generation-ii',
      'generation-iii',
      'generation-iv',
      'generation-v',
      'generation-vi',
      'generation-vii',
      'generation-viii',
      'generation-ix',
    ];
  }
}
