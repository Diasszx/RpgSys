// import {fetchClassDetail, fetchSpells} from './api.js';
// import { players } from './player.js';
// import { canUseMagic } from './rules.js';

// export const renderClasses = (classes, lista, detailDiv = null) => {  
//     lista.innerHTML = "";
//     classes.forEach(classe => {
//         const li = document.createElement('li');
//             li.textContent = classe.name;

//             // para detalhe
//             li.style.cursor = "pointer";
//             li.addEventListener('click', async () =>{
//                 try {
//                     detailDiv.innerHTML = "Carregando detalhes...";
//                     const detail = await fetchClassDetail(classe.index);
//                      renderClassDetail(detail, detailDiv);
//                 } catch (error) {
//                     console.error(error);
//                 }
//             })

//             lista.appendChild(li);  
//     });
// }

// export const renderClassDetail = (data, detailDiv) => {
//     detailDiv.innerHTML = `
//     <h2>${data.name}</h2>
//     <p><strong>Hit Die:</strong> ${data.hit_die}</p>
//     <p><strong>Proficiências:</strong></p>
//     <ul>
//         ${data.proficiencies.map(p => `<li>${p.name}</li>`).join("")}
//     </ul>`;
// };

// export const filterClasses = (search, allClasses, lista) => {
//     if (!allClasses || allClasses.length === 0) {
//         return;
//     }

//     const filtered = allClasses.filter(classe =>
//         classe.name.toLowerCase().includes(search.toLowerCase())
//     );

//     renderClasses(filtered, lista)
// }

// export const renderOptionsClasses = (classes, combo) => {
    
//     combo.innerHTML = '<option value="">Selecione uma classe...</option>';
//     classes.forEach(classe => {
//         const option = document.createElement('option');
//             option.value = classe.name;
//             option.textContent = classe.name;
//             combo.appendChild(option);  
//     });
// }

// export const renderSpellsCombo = async (spellCombo) => {
    
//     const spells = await fetchSpells();
    
//     spellCombo.innerHTML = `
//         <option value="">Escolha uma magia...</option>
//         ${spells.map(s => `<option value="${s.index}">${s.name}</option>`).join("")}
//     `;
// };

// export const renderPlayers = (players, playerList) => {
//     playerList.innerHTML = "";
    
//     players.forEach(player => {
//         const li = document.createElement('li');
//         const isWizard = canUseMagic(player);

//         li.innerHTML = `
//             <span><strong>${player.name}</strong> - Lvl ${player.level} ${player.playerClass}</span>
//             <button class="btn-delete">Remover</button>
//             <button class="btn-uplvl">Upar</button>
//             <button class="btn-spells" ${!isWizard ? 'disabled' : ''}>Spells</button>
//             ${!isWizard ? '<small style="color: gray;">(Apenas Wizards usam magia)</small>' : ''}
//             <p><small>Magias: ${player.spells.length > 0 ? player.spells.join(", ") : "Nenhuma"}</small></p>
//         `;
        
//         const btnDel = li.querySelector('.btn-delete');
//         btnDel.addEventListener('click', () => {
//             removePlayer(player.id)
//             renderPlayers(players, playerList);
//         });

//         const btnUp = li.querySelector('.btn-uplvl');
//         btnUp.addEventListener('click', () => {
//            updateLevel(player.id);
//         });

//         //if (isWizard) {
//             //const btnSpells = li.querySelector('.btn-spells');
//             //btnSpells.addEventListener('click', () => {
//               //  currentPlayerId = player.id;
//                // modal.classList.remove('modal-hidden'); // Mostra a janela!
//                // renderSpellsCombo(spellCombo);
//             //});
//        // }
        
//         //btnCloseModal.addEventListener('click', () => {
//             //modal.classList.add('modal-hidden');
//        // });
        
//         playerList.appendChild(li);
//     }); 
// };

