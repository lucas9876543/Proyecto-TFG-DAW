const modal = document.getElementById("pokemon-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modalContent = document.querySelector(".modal-content");
const modalInfo = document.getElementById("modal-pokemon-info");
const prevPokemonBtn = document.getElementById("prev-pokemon");
const nextPokemonBtn = document.getElementById("next-pokemon");

// Variables de estado
let currentPokemonIndex = 0;
let currentPokemonList = [];
let filteredPokemonList = [];

// Función para abrir el modal
function openModal(pokemon) {
    modal.style.display = "flex";
    filteredPokemonList = getVisiblePokemonList();
    currentPokemonIndex = filteredPokemonList.findIndex(p => p.id === pokemon.id);
    updateModalContent(pokemon);
}

// Obtener la lista de Pokémon VISIBLES
function getVisiblePokemonList() {
    const visibleCards = Array.from(document.querySelectorAll('.pokemon-card')).filter(card => 
        card.style.display !== "none"
    );
    return visibleCards.map(card => {
        const pokemonId = parseInt(card.dataset.id);
        return currentPokemonList.find(p => p.id === pokemonId);
    }).filter(p => p !== undefined);
}

// Actualizar el contenido del modal
function updateModalContent(pokemon) {
    if (!pokemon) return;

    // Resetear estilos y agregar tipo primario
    modalContent.className = "modal-content";
    modalContent.classList.add(pokemon.types[0].type.name);

    // Fondo degradado para tipos duales
    if (pokemon.types.length > 1) {
        const type1 = pokemon.types[0].type.name;
        const type2 = pokemon.types[1].type.name;
        modalContent.style.setProperty("--type1-color", getTypeColor(type1));
        modalContent.style.setProperty("--type2-color", getTypeColor(type2));
        modalContent.setAttribute("data-types", `${type1},${type2}`);
    } else {
        // Asegurar que Pokémon con un solo tipo tengan su color
        const type1 = pokemon.types[0].type.name;
        modalContent.style.setProperty("--type1-color", getTypeColor(type1));
        modalContent.removeAttribute("data-types");
    }

    // Generar HTML para stats
    const statsHTML = pokemon.stats.map(stat => `
        <div class="stat-bar-container">
            <div class="stat-bar-label">${stat.stat.name.toUpperCase()}</div>
            <div class="stat-bar">
                <div class="stat-bar-progress" style="width: ${(stat.base_stat / 255) * 100}%;"></div>
            </div>
            <span class="stat-bar-value">${stat.base_stat}</span>
        </div>
    `).join("");

    // Generar HTML para tipos
    const typesHTML = pokemon.types.map(type => `
        <span class="type-badge ${type.type.name}">${type.type.name.toUpperCase()}</span>
    `).join("");

    // Insertar contenido en el modal
    modalInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Altura: ${pokemon.height / 10} m</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <div class="types-container">
            ${typesHTML}
        </div>
        <div class="stats-container">
            ${statsHTML}
        </div>
    `;

    const starBtn = document.createElement('button');
    starBtn.classList.add('modal-star');
    starBtn.innerHTML = '★';
    starBtn.style.color = isFavorite(pokemon.id) ? '#FFD700' : '#000';
    modalContent.appendChild(starBtn);

    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isNowFavorite = toggleFavorite(pokemon.id);
        starBtn.style.color = isNowFavorite ? '#FFD700' : '#000';
        
        // Actualizar estrella en la tarjeta si está visible
        const card = document.querySelector(`.pokemon-card[data-id="${pokemon.id}"]`);
        if (card) {
            const cardStar = card.querySelector('.star-btn');
            if (cardStar) {
                cardStar.style.color = isNowFavorite ? '#FFD700' : '#000';
            }
        }
    });
}

// Navegación entre Pokémon
prevPokemonBtn.addEventListener("click", () => {
    if (filteredPokemonList.length === 0) return;
    currentPokemonIndex = (currentPokemonIndex - 1 + filteredPokemonList.length) % filteredPokemonList.length;
    updateModalContent(filteredPokemonList[currentPokemonIndex]);
});

nextPokemonBtn.addEventListener("click", () => {
    if (filteredPokemonList.length === 0) return;
    currentPokemonIndex = (currentPokemonIndex + 1) % filteredPokemonList.length;
    updateModalContent(filteredPokemonList[currentPokemonIndex]);
});

// Cerrar modal
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Función para obtener color según el tipo
function getTypeColor(type) {
    const typeColors = {
        fire: "#FF6B6B", water: "#4D96FF", grass: "#6BCB77", electric: "#FFD93D",
        ground: "#E4A444", rock: "#A38C21", fairy: "#FF9F9F", poison: "#9F5F80",
        bug: "#9BBF30", dragon: "#6F35FC", psychic: "#FF6B9E", flying: "#A890F0",
        fighting: "#C03028", normal: "#A8A878", ghost: "#705898", ice: "#98D8D8",
        steel: "#B8B8D0", dark: "#705848"
    };
    return typeColors[type] || "#F5F5F5";
}

// Funciones globales
window.openModal = openModal;
window.setCurrentPokemonList = (list) => {
    currentPokemonList = list;
};