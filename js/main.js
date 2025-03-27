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
    9: { start: 906, end: 1025 } // Generación 9
};

// Función para obtener los Pokémon de una generación específica
async function fetchPokemon(generation) {
    pokedexContainer.innerHTML = ""; // Limpiar el contenedor

    const range = generationRanges[generation];
    const pokemonIds = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);

    const pokemonPromises = pokemonIds.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error(`Error cargando Pokémon ${id}:`, error);
                return null;
            })
    );

    const allPokemon = (await Promise.all(pokemonPromises)).filter(pokemon => pokemon !== null);
    allPokemon.sort((a, b) => a.id - b.id);

    // Aplicar filtro de tipo
    const selectedType = document.getElementById("type-filter").value;
    const filteredPokemon = selectedType 
        ? allPokemon.filter(pokemon => pokemon.types.some(type => type.type.name === selectedType))
        : allPokemon;

    // Crear tarjetas
    filteredPokemon.forEach(pokemon => createPokemonCard(pokemon));
}

// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    // Asegurar que se añade la clase del tipo primario
    card.classList.add(pokemon.types[0].type.name);
    card.dataset.id = pokemon.id;
    card.dataset.types = pokemon.types.map(type => type.type.name).join(",");

    // Fondo para tipos duales
    if (pokemon.types.length > 1) {
        const type1 = pokemon.types[0].type.name;
        const type2 = pokemon.types[1].type.name;
        card.style.setProperty("--type1-color", getTypeColor(type1));
        card.style.setProperty("--type2-color", getTypeColor(type2));
    } else {
        // Asegurar que Pokémon con un solo tipo tengan su color
        const type1 = pokemon.types[0].type.name;
        card.style.setProperty("--type1-color", getTypeColor(type1));
    }

    // Botón de favoritos
    const starBtn = document.createElement('button');
    starBtn.classList.add('star-btn');
    starBtn.innerHTML = '★';
    starBtn.style.color = isFavorite(pokemon.id) ? '#FFD700' : '#000';
    card.appendChild(starBtn);

    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isNowFavorite = toggleFavorite(pokemon.id);
        starBtn.style.color = isNowFavorite ? '#FFD700' : '#000';
    });

    // Imagen y nombre
    const image = document.createElement("img");
    image.src = pokemon.sprites.front_default || 'img/pokeball-placeholder.png';
    image.alt = pokemon.name;
    image.onerror = () => { image.src = 'img/pokeball-placeholder.png'; };

    const name = document.createElement("h3");
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    card.appendChild(image);
    card.appendChild(name);

    // Evento para abrir modal
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

    pokedexContainer.appendChild(card);
}

// Función para obtener color según tipo
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

// Cargar Generación 1 por defecto
fetchPokemon(1);