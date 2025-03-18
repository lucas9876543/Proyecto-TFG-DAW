const modal = document.getElementById("pokemon-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modalContent = document.querySelector(".modal-content");
const modalInfo = document.getElementById("modal-pokemon-info");
const prevPokemonBtn = document.getElementById("prev-pokemon");
const nextPokemonBtn = document.getElementById("next-pokemon");

let currentPokemonIndex = 0; // Índice del Pokémon actual en el modal
let currentPokemonList = []; // Lista de Pokémon actual (los que se muestran en la Pokedex)

// Función para abrir el modal y mostrar la información del Pokémon
function openModal(pokemon) {
    modal.style.display = "flex";
    currentPokemonIndex = currentPokemonList.findIndex(p => p.id === pokemon.id);
    updateModalContent(pokemon);
}

// Función para actualizar el contenido del modal con la información del Pokémon
function updateModalContent(pokemon) {
    if (!pokemon) {
        console.error("Pokémon no definido");
        return;
    }

    // Limpiar clases anteriores del modal
    modalContent.className = "modal-content"; // Resetear clases
    modalContent.classList.add(pokemon.types[0].type.name); // Agregar clase del tipo

    // Establecer colores para el fondo diagonal si tiene dos tipos
    if (pokemon.types.length > 1) {
        const type1 = pokemon.types[0].type.name;
        const type2 = pokemon.types[1].type.name;
        modalContent.style.setProperty("--type1-color", getTypeColor(type1));
        modalContent.style.setProperty("--type2-color", getTypeColor(type2));
        modalContent.setAttribute("data-types", `${type1},${type2}`);
    } else {
        // Si tiene un solo tipo, establecer solo el primer color
        const type1 = pokemon.types[0].type.name;
        modalContent.style.setProperty("--type1-color", getTypeColor(type1));
        modalContent.removeAttribute("data-types");
    }

    // Crear las barras de stats
    const statsHTML = pokemon.stats.map(stat => `
        <div class="stat-bar-container">
            <div class="stat-bar-label">${stat.stat.name.toUpperCase()}</div>
            <div class="stat-bar">
                <div class="stat-bar-progress" style="width: ${(stat.base_stat / 255) * 100}%;"></div>
            </div>
            <span class="stat-bar-value">${stat.base_stat}</span>
        </div>
    `).join("");

    // Crear los tipos de Pokémon
    const typesHTML = pokemon.types.map(type => `
        <span class="type-badge ${type.type.name}">${type.type.name.toUpperCase()}</span>
    `).join("");

    // Mostrar más información en el modal
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

// Función para obtener el color basado en el tipo de Pokémon
function getTypeColor(type) {
    const typeColors = {
        fire: "#EE8130",
        water: "#6390F0",
        grass: "#7AC74C",
        electric: "#F7D02C",
        ground: "#E2BF65",
        rock: "#B6A136",
        fairy: "#D685AD",
        poison: "#A33EA1",
        bug: "#A6B91A",
        dragon: "#6F35FC",
        psychic: "#F95587",
        flying: "#A98FF3",
        fighting: "#C22E28",
        normal: "#A8A77A",
        ghost: "#735797",
        ice: "#96D9D6",
        steel: "#B7B7CE",
        dark: "#705746",
    };
    return typeColors[type] || "#F5F5F5";
}

// Función para cerrar el modal
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Función para ir al Pokémon anterior
prevPokemonBtn.addEventListener("click", () => {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        updateModalContent(currentPokemonList[currentPokemonIndex]);
    }
});

// Función para ir al siguiente Pokémon
nextPokemonBtn.addEventListener("click", () => {
    if (currentPokemonIndex < currentPokemonList.length - 1) {
        currentPokemonIndex++;
        updateModalContent(currentPokemonList[currentPokemonIndex]);
    }
});

// Exportar funciones para ser usadas en otros archivos
window.openModal = openModal;
window.setCurrentPokemonList = (list) => {
    currentPokemonList = list;
};