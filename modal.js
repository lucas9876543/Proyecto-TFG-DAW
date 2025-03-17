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

    // Mostrar más información en el modal
    modalInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Altura: ${pokemon.height / 10} m</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <p>HP: ${pokemon.stats[0].base_stat}</p>
        <p>Ataque: ${pokemon.stats[1].base_stat}</p>
        <p>Defensa: ${pokemon.stats[2].base_stat}</p>
        <p>Velocidad: ${pokemon.stats[5].base_stat}</p>
        <p>Tipos: ${pokemon.types.map(type => type.type.name).join(", ")}</p>
    `;
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