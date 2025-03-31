const pokedexContainer = document.getElementById("pokedex-container");
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const generationFilter = document.getElementById("generation-filter");

// Rangos de Pokémon por generación
const generationRanges = {
    1: { start: 1, end: 151 },   // Generación 1
    2: { start: 152, end: 251 }, // Generación 2
    3: { start: 252, end: 386 }, // Generación 3
    4: { start: 387, end: 493 }, // Generación 4
    5: { start: 494, end: 649 }, // Generación 5
    6: { start: 650, end: 721 }, // Generación 6
    7: { start: 722, end: 809 }, // Generación 7
    8: { start: 810, end: 905 }, // Generación 8
    9: { start: 906, end: 1025 } // Generación 9
};

// Llenar el desplegable de tipos y generaciones
async function fetchFilters() {
    // Tipos
    const typeResponse = await fetch("https://pokeapi.co/api/v2/type/");
    const typeData = await typeResponse.json();
    const excludedTypes = ["stellar", "unknown"];
    const types = typeData.results
        .map(type => type.name)
        .filter(type => !excludedTypes.includes(type));

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeFilter.appendChild(option);
    });

    // Generaciones
    const genResponse = await fetch("https://pokeapi.co/api/v2/generation/");
    const genData = await genResponse.json();
    const generations = genData.results.map((gen, index) => ({
        id: index + 1,
        name: gen.name
    }));

    generations.forEach(gen => {
        const option = document.createElement("option");
        option.value = gen.id;
        option.textContent = `Generación ${gen.id}`;
        generationFilter.appendChild(option);
    });
}

// Función para verificar si un Pokémon pertenece a una generación
function isPokemonInGeneration(pokemonId, generation) {
    if (!generation) return true;
    const range = generationRanges[generation];
    return pokemonId >= range.start && pokemonId <= range.end;
}

// Función para crear tarjetas de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.classList.add(pokemon.types[0].type.name);
    card.dataset.id = pokemon.id;
    card.dataset.types = pokemon.types.map(type => type.type.name).join(",");

    if (pokemon.types.length > 1) {
        const type1 = pokemon.types[0].type.name;
        const type2 = pokemon.types[1].type.name;
        card.style.setProperty("--type1-color", getTypeColor(type1));
        card.style.setProperty("--type2-color", getTypeColor(type2));
    }

    const starBtn = document.createElement('button');
    starBtn.classList.add('star-btn', 'favorite');
    starBtn.innerHTML = '★';
    card.appendChild(starBtn);

    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(pokemon.id);
        card.remove();
        if (pokedexContainer.children.length === 0) {
            pokedexContainer.innerHTML = "<p>No tienes Pokémon favoritos aún</p>";
        }
    });

    const image = document.createElement("img");
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    const name = document.createElement("h3");
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    card.appendChild(image);
    card.appendChild(name);
    pokedexContainer.appendChild(card);

    card.addEventListener('click', () => {
        const pokemonCards = Array.from(document.querySelectorAll(".pokemon-card"));
        const currentPokemonList = pokemonCards.map(card => {
            const pokemonId = parseInt(card.dataset.id);
            return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                .then(response => response.json());
        });

        Promise.all(currentPokemonList).then(pokemonData => {
            window.setCurrentPokemonList(pokemonData);
            window.openModal(pokemon);
        });
    });
}

// Función para filtrar Pokémon
function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedGeneration = generationFilter.value;
    const pokemonCards = document.querySelectorAll(".pokemon-card");

    pokemonCards.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        const types = card.dataset.types.split(",");
        const pokemonId = parseInt(card.dataset.id);
        
        const matchesSearch = name.includes(searchTerm);
        const matchesType = selectedType === "" || types.includes(selectedType);
        const matchesGeneration = isPokemonInGeneration(pokemonId, selectedGeneration);
        
        card.style.display = matchesSearch && matchesType && matchesGeneration ? "block" : "none";
    });
}

// Cargar Pokémon favoritos
async function loadFavoritePokemon() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        pokedexContainer.innerHTML = "<p>No tienes Pokémon favoritos aún</p>";
        return;
    }

    const pokemonPromises = favorites.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
    );
    const pokemonList = await Promise.all(pokemonPromises);

    pokedexContainer.innerHTML = "";
    pokemonList.forEach(pokemon => {
        createPokemonCard(pokemon);
    });
}

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

// Event listeners
searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", filterPokemon);
generationFilter.addEventListener("change", filterPokemon);

// Inicializar
fetchFilters();
loadFavoritePokemon();