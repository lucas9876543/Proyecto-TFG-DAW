// Elementos del DOM
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const generationFilter = document.getElementById("generation-filter");

// Variable para almacenar la generación actual
let currentGeneration = 1;

// Llenar el desplegable de tipos
async function fetchTypes() {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const data = await response.json();
    const excludedTypes = ["stellar", "unknown"];
    const types = data.results
        .map(type => type.name)
        .filter(type => !excludedTypes.includes(type));

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeFilter.appendChild(option);
    });
}

// Llenar el desplegable de generaciones
async function fetchGenerations() {
    const response = await fetch("https://pokeapi.co/api/v2/generation/");
    const data = await response.json();
    const generations = data.results.map(gen => gen.name);

    generations.forEach((gen, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.textContent = `Generación ${index + 1}`;
        generationFilter.appendChild(option);
    });
    generationFilter.value = currentGeneration;
}

// Función para filtrar Pokémon
function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const pokemonCards = document.querySelectorAll(".pokemon-card");

    pokemonCards.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        const types = card.dataset.types.split(",");
        const matchesSearch = name.includes(searchTerm);
        const matchesType = selectedType === "" || types.includes(selectedType);
        card.style.display = matchesSearch && matchesType ? "block" : "none";
    });
}

// Función para aplicar ambos filtros (generación y tipo)
function applyFilters() {
    fetchPokemon(currentGeneration);
}

// Event listeners
searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", applyFilters);
generationFilter.addEventListener("change", () => {
    currentGeneration = generationFilter.value;
    applyFilters();
});

// Inicialización
fetchTypes();
fetchGenerations();