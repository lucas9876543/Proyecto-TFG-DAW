import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<number[]>([])
  public favorites$ = this.favoritesSubject.asObservable()

  constructor() {
    this.loadFavorites()
  }

  private loadFavorites(): void {
    const favorites = localStorage.getItem("favorites")
    if (favorites) {
      this.favoritesSubject.next(JSON.parse(favorites))
    }
  }

  private saveFavorites(favorites: number[]): void {
    localStorage.setItem("favorites", JSON.stringify(favorites))
    this.favoritesSubject.next(favorites)
  }

  addToFavorites(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.value
    if (!currentFavorites.includes(pokemonId)) {
      const newFavorites = [...currentFavorites, pokemonId]
      this.saveFavorites(newFavorites)
    }
  }

  removeFromFavorites(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.value
    const newFavorites = currentFavorites.filter((id) => id !== pokemonId)
    this.saveFavorites(newFavorites)
  }

  toggleFavorite(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.value
    if (currentFavorites.includes(pokemonId)) {
      this.removeFromFavorites(pokemonId)
    } else {
      this.addToFavorites(pokemonId)
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.value.includes(pokemonId)
  }

  getFavorites(): number[] {
    return this.favoritesSubject.value
  }
}
