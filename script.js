const btn_classes = document.querySelector('#btn_class')
const detailDiv = document.querySelector('#class_detail');
const lista = document.querySelector('#lista_classes');
const combo = document.querySelector('#classes_select');
const inputName = document.querySelector('#player_name');
const btnCreate = document.querySelector('#btn_create');
const playerList = document.querySelector('#lista_personagens');
const spellSelected = document.querySelector('#spells_select');
const modal = document.querySelector('#modal_overlay');
const btnCloseModal = document.querySelector('#btn_close_modal');
const btnAddSpell = document.querySelector('#btn_add_spell');
const btnNfc = document.querySelector('#btn_nfc')
 
const url = 'https://www.dnd5eapi.co/api/classes';
const urlSpells = 'https://www.dnd5eapi.co/api/spells';

let allClasses = [];
let classDetailsCache = {};
let players = [];
let currentPlayerId = null;

const fetchClasses = async (url) => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    return data.results;
}

const renderClasses = (classes) => {  
    lista.innerHTML = "";
    classes.forEach(classe => {
        const li = document.createElement('li');
            li.textContent = classe.name;

            // para detalhe
            li.style.cursor = "pointer";
            li.addEventListener('click', async () =>{
                try {
                    detailDiv.innerHTML = "Carregando detalhes...";
                    const detail = await fetchClassDetail(classe.index);
                    renderClassDetail(detail);
                } catch (error) {
                    console.error(error);
                }
            })

            lista.appendChild(li);  
    });
}

const handleClick = async () =>{
    lista.textContent = "Carregando...";

    try {
        const classes = await fetchClasses(url);   
        allClasses = classes;
        renderClasses(classes)
        renderOptionsClasses(classes)

    } catch (error) {
        console.error("Falha na task:", error);        
        lista.textContent = "Erro ao carregar dados";
    }
};

const filterClasses = (search) => {
    if (!allClasses || allClasses.length === 0) {
    return;
    }

    const filtered = allClasses.filter(classe =>
        classe.name.toLowerCase().includes(search.toLowerCase())
    );

    renderClasses(filtered)
}

const fetchClassDetail = async (index) => {
    if(classDetailsCache[index]){
        return classDetailsCache[index];
    }

    const response = await fetch(`https://www.dnd5eapi.co/api/classes/${index}`);

    if(!response.ok){
        throw new Error(`Erro ao buscar detalhes: ${response.status}`);
    }

    const data = await response.json();
    classDetailsCache[index] = data;
    return data;
}

const renderClassDetail = (data) => {
    detailDiv.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Hit Die:</strong> ${data.hit_die}</p>
    <p><strong>Proficiências:</strong></p>
    <ul>
        ${data.proficiencies.map(p => `<li>${p.name}</li>`).join("")}
    </ul>`;
};

const renderOptionsClasses = (classes) => {
    
    combo.innerHTML = '<option value="">Selecione uma classe...</option>';
    classes.forEach(classe => {
        const option = document.createElement('option');
            option.value = classe.name;
            option.textContent = classe.name;
            combo.appendChild(option);  
    });
}


const getPlayerForm = () => {
    const name = inputName.value.trim();
    const className = combo.value;

    if(name === "" || className === ""){
        alert("Preencha o nome e escolha uma classe!");
        return;
    }

    const data = {name, className};
    return data;
}

const createPlayer = (dataForm) => {
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

const renderPlayers = () => {
    playerList.innerHTML = "";
    
    players.forEach(player => {
        const li = document.createElement('li');
        const isWizard = canUseMagic(player);

        li.innerHTML = `
            <span><strong>${player.name}</strong> - Lvl ${player.level} ${player.playerClass}</span>
            <button class="btn-delete">Remover</button>
            <button class="btn-uplvl">Upar</button>
            <button class="btn-spells" ${!isWizard ? 'disabled' : ''}>Spells</button>
            ${!isWizard ? '<small style="color: gray;">(Apenas Wizards usam magia)</small>' : ''}
            <p><small>Magias: ${player.spells.length > 0 ? player.spells.join(", ") : "Nenhuma"}</small></p>
        `;
        
        const btnDel = li.querySelector('.btn-delete');
        btnDel.addEventListener('click', () => {
            removePlayer(player.id)
        });

        const btnUp = li.querySelector('.btn-uplvl');
        btnUp.addEventListener('click', () => {
            updateLevel(player.id);
        });

        if (isWizard) {
            const btnSpells = li.querySelector('.btn-spells');
            btnSpells.addEventListener('click', () => {
                currentPlayerId = player.id;
                modal.classList.remove('modal-hidden'); // Mostra a janela!
                renderSpellsCombo();
            });
        }
        
        btnCloseModal.addEventListener('click', () => {
            modal.classList.add('modal-hidden');
        });
        
        playerList.appendChild(li);
    }); 
};

const removePlayer = (id) => {
    players = players.filter(p => p.id !== id);
    renderPlayers();
};

const updateLevel = (id) => {
    players = players.map(p => {
        if(p.id === id && p.level < 20 ){
            return{...p, level: p.level + 1}; 
        }

        if(p.id == id && p.level >= 20){
            alert("Level máximo alcançado!");
        }

        return p;
    });
    
    renderPlayers();
}

const canUseMagic = (player) => {
    return player.playerClass === "Wizard";
};

const fetchSpells = async () => {
    const response = await fetch(urlSpells);

    if(!response.ok){
        console.error("Erro ao carregar spells");
    }

    const data = await response.json();
    return data.results; 
};

const renderSpellsCombo = async () => {
    const spellCombo = document.querySelector('#spells_select');
    
    const spells = await fetchSpells();
    
    spellCombo.innerHTML = `
        <option value="">Escolha uma magia...</option>
        ${spells.map(s => `<option value="${s.index}">${s.name}</option>`).join("")}
    `;
};

const addPlayerSpell = (spellIndex) => {
    if (!currentPlayerId) return;
    
    players = players.map(p => {
        if(p.id === currentPlayerId){
            if (!p.spells.includes(spellIndex)) {
                return { ...p, spells: [...p.spells, spellIndex] 
                };
            }   
        }

        return p;
    });

    renderPlayers();
    modal.classList.add('modal-hidden');
}

const handleClickPlayer = () =>{
    try { 
        const data = getPlayerForm();

        if (!data) return;

        createPlayer(data);
        renderPlayers();
    
    } catch (error) {
        console.error("Falha na task:", error);        
        lista.textContent = "Erro ao criar player";
    }
};


const openModal = (content) => {
    modalBody.innerHTML = content; // Injeta o que você quiser (lista de spells, etc)
    modal.classList.remove('modal-hidden');
};

const closeModal = () => {
    modal.classList.add('modal-hidden');
};

const urlNFC = 'https://dagny-mollusklike-exasperatedly.ngrok-free.dev/clientes';

async function lerNFC() {
  if ('NDEFReader' in window) {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();

      console.log("Aproxime o NFC...");

      ndef.onreading = async event => {
        const { message, serialNumber } = event;

        console.log("Tag ID:", serialNumber);

        for (const record of message.records) {
          const textDecoder = new TextDecoder(record.encoding);
          const data = textDecoder.decode(record.data);

          console.log("Conteúdo NFC:", data);
          alert("Lida com sucesso!");

          try {
            // 🔥 chamada ao backend
            const response = await fetch(`${urlNFC}/${data}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            console.log("Resposta API:", result);

            alert(`Cliente encontrado: ${result.nome}`);

          } catch (apiError) {
            console.error("Erro ao consultar API:", apiError);
            alert("Erro ao buscar cliente");
          }
        }
      };

    } catch (error) {
      console.error("Erro ao ler NFC:", error);
    }
  } else {
    alert("NFC não suportado neste dispositivo");
  }
}


btnNfc.addEventListener('click', lerNFC)

btn_classes.addEventListener('click', handleClick)

const input = document.querySelector('#input_filter')

input.addEventListener('input', (event) => {
    const value = event.target.value;
    filterClasses(value);
});

btnAddSpell.addEventListener('click', () => {
    const selectedValue = spellSelected.value;

    if (selectedValue) {
        addPlayerSpell(selectedValue);
        closeModal(); 
    } else {
        alert("Selecione uma magia primeiro!");
    }
});

btnCreate.addEventListener('click', handleClickPlayer)




