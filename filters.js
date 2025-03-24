const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const generationFilter = document.getElementById("generation-filter");

// Llenar el desplegable de tipos (excluyendo "stellar" y "unknown")
async function fetchTypes() {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const data = await response.json();
    const excludedTypes = ["stellar", "unknown"];
    const types = data.results
        .map(type => type.name)
        .filter(type => !excludedTypes.includes(type)); // Filtramos tipos no deseados

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeFilter.appendChild(option);
    });
}

// Llenar el desplegable de generaciones (sin cambios)
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
    generationFilter.value = 1;
}

// Función para cargar Pokémon con el tipo seleccionado
async function fetchPokemon(generation) {
    pokedexContainer.innerHTML = "";
    const range = generationRanges[generation];
    const pokemonIds = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);

    const pokemonPromises = pokemonIds.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json()));
    const allPokemon = await Promise.all(pokemonPromises);
    allPokemon.sort((a, b) => a.id - b.id);

    // Filtrar por tipo si hay uno seleccionado
    const selectedType = typeFilter.value;
    const filteredPokemon = selectedType 
        ? allPokemon.filter(pokemon => pokemon.types.some(type => type.type.name === selectedType))
        : allPokemon;

    filteredPokemon.forEach(pokemon => createPokemonCard(pokemon));
}

// Event listeners (actualizados)
searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", () => {
    const selectedGeneration = generationFilter.value;
    fetchPokemon(selectedGeneration); // Forzar recarga con el tipo seleccionado
});
generationFilter.addEventListener("change", () => {
    const selectedGeneration = generationFilter.value;
    fetchPokemon(selectedGeneration); // Mantiene el tipo seleccionado
});

// Función de filtrado (sin cambios)
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

fetchTypes();
fetchGenerations();