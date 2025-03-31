// shiny.js - Controlador de versión shiny
let shinyMode = false;
const shinyBtn = document.getElementById('shiny-btn');

// Función para alternar el modo shiny
function toggleShinyMode() {
    shinyMode = !shinyMode;
    shinyBtn.classList.toggle('active', shinyMode);
    updatePokemonImages();
    
    // Actualizar también la imagen en el modal si está abierto
    if (window.currentPokemonId) {
        const modalImg = document.querySelector('#modal-pokemon-info img');
        if (modalImg) {
            modalImg.src = shinyMode 
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${window.currentPokemonId}.png`
                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${window.currentPokemonId}.png`;
        }
    }
}

// Función para actualizar las imágenes de los Pokémon
function updatePokemonImages() {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        const pokemonId = card.dataset.id;
        const img = card.querySelector('img');
        if (img) {
            img.src = shinyMode 
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`
                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        }
    });
}

// Event listener para el botón shiny
if (shinyBtn) {
    shinyBtn.addEventListener('click', toggleShinyMode);
}

// Guardar referencia original de openModal
const originalOpenModal = window.openModal;

// Extender la función openModal
window.openModal = function(pokemon) {
    window.currentPokemonId = pokemon.id;
    originalOpenModal(pokemon);
    
    // Actualizar imagen shiny si es necesario
    if (shinyMode) {
        const modalImg = document.querySelector('#modal-pokemon-info img');
        if (modalImg) {
            modalImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;
        }
    }
};