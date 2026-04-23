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
const spellCombo = document.querySelector('#spells_select');

import { fetchClasses, url} from './api.js';
import { renderClasses, filterClasses, renderClassDetail, renderOptionsClasses, renderSpellsCombo, renderPlayers} from './render.js'
import { createPlayer, players, getPlayerForm} from './player.js';

let allClasses = [];
let currentPlayerId = null;

const handleClick = async () =>{
    lista.textContent = "Carregando...";

    try {
        const classes = await fetchClasses(url);   
        allClasses = classes;
        renderClasses(classes, lista, detailDiv)
        renderOptionsClasses(classes, combo)

    } catch (error) {
        console.error("Falha na task:", error);        
        lista.textContent = "Erro ao carregar dados";
    }
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
};

const canUseMagic = (player) => {
    return player.playerClass === "Wizard";
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
};

const handleClickPlayer = () =>{
    try { 
        const data = getPlayerForm(inputName, combo);

        if (!data) return;

        createPlayer(data, inputName, combo);
        renderPlayers(players, playerList);
    
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
}


const urlNFC = 'https://dagny-mollusklike-exasperatedly.ngrok-free.dev/clientes';
const leiturasRecentes = new Map();
const INTERVALO_MS = 3000; // 3 segundos

function debugLog(message) {
  const debugEl = document.getElementById('debug');
  if (!debugEl) return;

  const log = document.createElement('div');
  log.textContent = message;

  debugEl.appendChild(log);
  debugEl.scrollTop = debugEl.scrollHeight;
}

async function lerNFC() {
  if (!('NDEFReader' in window)) {
    console.log("Web NFC não suportado neste dispositivo.");
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    console.log("Aproxime um cartão NFC...");

    ndef.onreading = async (event) => {
      const { message, serialNumber } = event;
      const agora = Date.now();

      // 🔒 BLOQUEIO DE LEITURA DUPLICADA
      if (leiturasRecentes.has(serialNumber)) {
        const ultima = leiturasRecentes.get(serialNumber);

        if (agora - ultima < INTERVALO_MS) {
          console.log("Leitura ignorada (duplicada):", serialNumber);
          return;
        }
      }

      // Atualiza registro da leitura
      leiturasRecentes.set(serialNumber, agora);

      // Limpeza automática
      setTimeout(() => {
        leiturasRecentes.delete(serialNumber);
      }, INTERVALO_MS);

      console.log("Tag ID:", serialNumber);

      for (const record of message.records) {
        let data = "";

        // 🔧 decode seguro
        if (record.recordType === "text") {
          data = new TextDecoder(record.encoding || "utf-8")
            .decode(record.data);
        } else {
          data = new TextDecoder().decode(record.data);
        }

        console.log("Conteúdo NFC:", data);

        try {
          const response = await fetch(`${urlNFC}/${data}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            }
          });

          // ✅ Agora sim valida corretamente
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }

          debugLog(`Status: ${response.status}`);
          debugLog("Tag ID: " + serialNumber);
          debugLog("Conteúdo NFC: " + data);

          const result = await response.json();
          console.log("Resposta:", result);

        } catch (error) {
          console.error("Erro na requisição:", error);
        }
      }
    };

    ndef.onerror = (error) => {
      console.error("Erro ao ler NFC:", error);
    };

  } catch (error) {
    console.error("Erro ao iniciar leitura NFC:", error);
  }
}

btn_classes.addEventListener('click', handleClick)

const input = document.querySelector('#input_filter')

input.addEventListener('input', (event) => {
    const value = event.target.value;
    filterClasses(value, allClasses, lista);
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

btnCreate.addEventListener('click', handleClickPlayer);

btnNfc.addEventListener('click', async () => {
    btnNfc.classList.add('active');

    try {
        await lerNFC();
    } finally {
        setTimeout(() => {
            btnNfc.classList.remove('active');
        }, 3000);
    }
});
