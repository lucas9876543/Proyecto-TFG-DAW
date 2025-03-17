const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const generationFilter = document.getElementById("generation-filter");

// Llenar el desplegable de tipos
async function fetchTypes() {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const data = await response.json();
    const types = data.results.map(type => type.name);

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

    // Agregar solo las generaciones (sin "Todas las generaciones")
    generations.forEach((gen, index) => {
        const option = document.createElement("option");
        option.value = index + 1; // Las generaciones son números (1, 2, 3, etc.)
        option.textContent = `Generación ${index + 1}`;
        generationFilter.appendChild(option);
    });

    // Seleccionar la Generación 1 por defecto
    generationFilter.value = 1;
}

// Llamar a las funciones para llenar los desplegables
fetchTypes();
fetchGenerations();

// Filtrar Pokémon
searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", filterPokemon);
generationFilter.addEventListener("change", () => {
    const selectedGeneration = generationFilter.value;
    fetchPokemon(selectedGeneration); // Cargar Pokémon de la generación seleccionada
});

function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    const pokemonCards = document.querySelectorAll(".pokemon-card");

    pokemonCards.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        const types = card.dataset.types.split(","); // Obtener los tipos del Pokémon

        const matchesSearch = name.includes(searchTerm);
        const matchesType = selectedType === "" || types.includes(selectedType);

        if (matchesSearch && matchesType) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}