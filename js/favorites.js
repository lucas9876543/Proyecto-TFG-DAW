// Manejo de favoritos
const FAVORITES_KEY = 'pokemon-favorites';

function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function toggleFavorite(pokemonId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(pokemonId);
    
    if (index === -1) {
        favorites.push(pokemonId);
    } else {
        favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
    return index === -1;
}

function isFavorite(pokemonId) {
    const favorites = getFavorites();
    return favorites.includes(pokemonId);
}

// Botón de favoritos en el header
document.getElementById('favorites-btn')?.addEventListener('click', () => {
    window.location.href = 'favorites.html';
});

// Botón de inicio en favoritos
document.getElementById('home-btn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
});