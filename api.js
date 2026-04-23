export const url = 'https://www.dnd5eapi.co/api/classes';
export const urlSpells = 'https://www.dnd5eapi.co/api/spells';
let classDetailsCache = {};

export const fetchClasses = async (url) => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    return data.results;
}

export const fetchClassDetail = async (index) => {
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

export const fetchSpells = async () => {
    const response = await fetch(urlSpells);

    if(!response.ok){
        console.error("Erro ao carregar spells");
    }

    const data = await response.json();
    return data.results; 
};