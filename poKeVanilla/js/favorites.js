// Manejo de favoritos
function getFavoritesKey() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? `pokemon-favorites-${currentUser.username}` : 'pokemon-favorites';
}

function getFavorites() {
    const key = getFavoritesKey();
    const favorites = localStorage.getItem(key);
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    const key = getFavoritesKey();
    localStorage.setItem(key, JSON.stringify(favorites));
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