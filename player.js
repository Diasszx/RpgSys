export let players = [];

export const createPlayer = (dataForm, inputName, combo) => {
    const newPlayer = {
        id: Date.now(),
        name: dataForm.name,
        playerClass: dataForm.className,
        level: 1,
        spells: []
    };

    players.push(newPlayer);

    inputName.value = "";
    combo.selectedIndex = 0;

    alert("Player criado com Sucesso!");
};

export const getPlayerForm = (inputName, combo) => {
    const name = inputName.value.trim();
    const className = combo.value;

    if(name === "" || className === ""){
        alert("Preencha o nome e escolha uma classe!");
        return;
    }

    const data = {name, className};
    return data; 
};

export const removePlayer = (id) => {
    players = players.filter(p => p.id !== id);
};

