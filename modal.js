const modal = document.getElementById("pokemon-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modalContent = document.querySelector(".modal-content");
const modalInfo = document.getElementById("modal-pokemon-info");
const prevPokemonBtn = document.getElementById("prev-pokemon");
const nextPokemonBtn = document.getElementById("next-pokemon");

// Variables de estado
let currentPokemonIndex = 0;
let currentPokemonList = []; // Todos los Pokémon cargados
let filteredPokemonList = []; // Pokémon visibles (filtrados por tipo/búsqueda)

// Función para abrir el modal
function openModal(pokemon) {
    modal.style.display = "flex";
    filteredPokemonList = getVisiblePokemonList(); // Actualizar lista filtrada
    currentPokemonIndex = filteredPokemonList.findIndex(p => p.id === pokemon.id);
    updateModalContent(pokemon);
}

// Obtener la lista de Pokémon VISIBLES (filtrados)
function getVisiblePokemonList() {
    const visibleCards = Array.from(document.querySelectorAll('.pokemon-card')).filter(card => 
        card.style.display !== "none" // Solo tarjetas visibles
    );
    return visibleCards.map(card => {
        const pokemonId = parseInt(card.dataset.id);
        return currentPokemonList.find(p => p.id === pokemonId);
    }).filter(p => p !== undefined); // Eliminar undefined
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
}

// Navegación entre Pokémon (¡CORREGIDO!)
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
        fire: "#EE8130", water: "#6390F0", grass: "#7AC74C", electric: "#F7D02C",
        ground: "#E2BF65", rock: "#B6A136", fairy: "#D685AD", poison: "#A33EA1",
        bug: "#A6B91A", dragon: "#6F35FC", psychic: "#F95587", flying: "#A98FF3",
        fighting: "#C22E28", normal: "#A8A77A", ghost: "#735797", ice: "#96D9D6",
        steel: "#B7B7CE", dark: "#705746"
    };
    return typeColors[type] || "#F5F5F5";
}

// Funciones globales
window.openModal = openModal;
window.setCurrentPokemonList = (list) => {
    currentPokemonList = list;
};