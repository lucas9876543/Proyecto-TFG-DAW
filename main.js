const pokedexContainer = document.getElementById("pokedex-container");

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
    9: { start: 906, end: 1025 }, // Generación 9
};

// Función para obtener los Pokémon de una generación específica
async function fetchPokemon(generation) {
    pokedexContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar nuevos Pokémon

    const range = generationRanges[generation];
    const allPokemon = [];
    for (let i = range.start; i <= range.end; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await response.json();
        allPokemon.push(data);
    }

    // Ordenar los Pokémon por su ID
    allPokemon.sort((a, b) => a.id - b.id);

    // Crear tarjetas para los Pokémon de la generación seleccionada
    allPokemon.forEach(pokemon => createPokemonCard(pokemon));
}

// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.classList.add(pokemon.types[0].type.name); // Agregar clase del tipo
    card.dataset.id = pokemon.id; // Agregar el ID del Pokémon
    card.dataset.types = pokemon.types.map(type => type.type.name).join(","); // Agregar los tipos del Pokémon

    const image = document.createElement("img");
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    const name = document.createElement("h3");
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    card.appendChild(image);
    card.appendChild(name);
    pokedexContainer.appendChild(card);

    card.addEventListener("click", () => {
        // Pasar la lista de Pokémon actual al modal
        const pokemonCards = Array.from(document.querySelectorAll(".pokemon-card"));
        const currentPokemonList = pokemonCards.map(card => {
            const pokemonId = parseInt(card.dataset.id);
            return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                .then(response => response.json());
        });

        // Esperar a que todas las promesas se resuelvan
        Promise.all(currentPokemonList).then(pokemonData => {
            window.setCurrentPokemonList(pokemonData);
            window.openModal(pokemon);
        });
    });
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

// Cargar Pokémon de la Generación 1 por defecto
fetchPokemon(1);