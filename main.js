document.addEventListener('DOMContentLoaded', function() {
    const notesContainer = document.getElementById('notes-container');
    const newNoteInput = document.getElementById('note-input');
    let chatGPTEnabled = false;
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    // Fechar modal
    span.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Fechar modal clicando fora
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Tratamento de Enter
    newNoteInput.addEventListener('keydown', async function(event) {
        if (event.key === 'Enter') {
            const inputText = newNoteInput.value.trim();

            let processedText = inputText;
            if (chatGPTEnabled && inputText) {
                processedText = await callGPT3(inputText);
            }
            
            if (processedText) {
                let parts = processedText.split(';');
                
                // Nova lógica para extrair a cor e o título
                let colorMatch = parts[0].match(/"#([0-9A-F]{6})"/i);
                let title = colorMatch ? parts[0].replace(colorMatch[0], '').trim() : parts[0];
                let color = colorMatch ? '#' + colorMatch[1] : '#333333';
                
                let items = parts.slice(1).map(item => ({ text: item, completed: false }));
                
                // Passe a cor como argumento aqui
                const newNote = createNote(title, color, items); 
                newNoteInput.value = '';
                notesContainer.appendChild(newNote);
                saveNotes();
            }
                        

        }
    });

    // Alternar GPT
    document.getElementById("GPT-button").addEventListener("click", function() {
        chatGPTEnabled = !chatGPTEnabled;
    });

    // Chamada para GPT-3
    async function callGPT3(inputText) {
        const prompt = `Transforme o seguinte texto em uma nota bem organizada, seguindo rigorosamente as regras de formatação definidas para este aplicativo. O objetivo é tornar o texto o mais claro e acessível possível e completar a nota para pessoas com itens que você julgue nescessário para a lista ficar completa.

        Regras de Formatação:
        1. Por favor, estabeleça uma cor para esta nota adicionando um código hexadecimal de cor logo após o título. O formato deve ser assim: ' "#XXXXXX" ', onde 'XXXXXX' é o código da cor que você escolher. Opte por uma cor suave, mas que represente bem o tema da lista em questão. Certifique-se de envolver o código de cor em aspas duplas.
        2. O título da nota deve ser separado dos itens da lista por um ponto e vírgula (;).
        3. Cada item da lista deve ser separado por um ponto e vírgula (;).
         
        
        Exemplo de Saída Esperada:
        "#111111" Título da Nota ;Item 1;Item 2;Item 3;Item 4;Item 5;Item 6;Item 7;Item 8;Item 9;Item 10;Item 11;Item 12;Item 13;Item 14;Item 15;Item 16;Item 17;Item 18;Item 19;Item 20;Item 21;Item 22;Item 23;Item 24;Item 25;Item 26;Item 27;Item 28;Item 29;Item 30;Item 31;Item 32;Item 33;Item 34;Item 35;Item 36;Item 37;Item 38;Item 39;Item 40;Item 41;Item 42;Item 43;Item 44;Item 45;Item 46;Item 47;Item 48;Item 49;Item 50
        
        Por favor, siga estas regras à risca e evite qualquer formatação. Adicione quantos itens forem nescessários e Faça o título da nota ser beeem breve mas que ao mesmo tempo resuma a lista. Lembre-se, coloque a cor da nota ao lado do título.
        
        Texto a transformar: ${inputText}`;  // Usar inputText em vez de userInput

        const apiKey = "";
        const payload = {
            prompt: prompt,
            max_tokens: 700
        };
        const config = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        try {
            const response = await fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", config);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                return "";
            } else {
                const data = await response.json();
                return data.choices[0].text.trim();
            }
        } catch (error) {
            console.error('API Call Error:', error);
            return "";
        }
    }
    


    



































// Função para criar uma nota
    function createNoteAndAppend(value) {
        if (value.trim() !== '') {
            let newNote = createNote(value);
            notesContainer.appendChild(newNote);
            saveNotes();
        }
    }
    
    // Adicionando evento de clique ao botão "💭"
    document.getElementById("brain-button").addEventListener('click', function() {
        createNoteAndAppend(newNoteInput.value);
        newNoteInput.value = ''; // Limpa o campo de entrada após adicionar a nota
    });
    

    function saveNotes() {
        let noteElements = Array.from(notesContainer.getElementsByClassName('note'));
        let notes = noteElements.map(note => {
            let items = Array.from(note.getElementsByClassName('item')).map(item => {
                return {
                    text: item.getElementsByTagName('p')[0].textContent,
                    completed: item.getElementsByTagName('input')[0].checked
                };
            });
            return {
                title: note.getElementsByTagName('h2')[0].textContent,
                items: items,
                color: note.style.backgroundColor // also save the note color
            };
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function createNote(title, color = '#333333', items = []) { 
        let note = document.createElement('div');
        note.classList.add('note');
        note.style.backgroundColor = color;
    
        let noteTitle = document.createElement('h2');
        noteTitle.textContent = title;
        noteTitle.contentEditable = true;
        note.appendChild(noteTitle);

        // CODIGO DA FORMATAÇÃO
        
        noteTitle.addEventListener('input', function() {
            updateNoteColorAndTitle(note, noteTitle.textContent);
            saveNotes();
        });
    
        let actualTitle = title;

        // Agora processe o título e os itens como você fez antes
        if (actualTitle.includes(';')) {
            let titleParts = actualTitle.split(';');
            noteTitle.textContent = titleParts[0];
            items = titleParts.slice(1).map(item => ({ text: item, completed: false }));
        } else {
            noteTitle.textContent = actualTitle;
        }


    
        const colors = ['#333333', '#2196f3', '#00BFFF', '#008B8B', '#00ffff', '#008000', '#2E8B57' , '#98FB98', '#4ee64e', '#4caf50', '#FFA07A','#C25E1C' ,'#FF8C00' , '#FFFF00' , '#F0E68C', '#FFD700', '#f44336', '#8B0000', '#A52A2A', '#DC143C', '#C71585', '#FF1493', '#FF69B4', '#BA55D3', '#9370DB', '#9c27b0', '#22142b', '#162b14', '#2b1414', '#15142b'];
    
        let colorPicker = document.createElement('div');
        colorPicker.classList.add('color-picker');
        colorPicker.style.display = 'none';
    
        for (let color of colors) {
            let colorOption = document.createElement('div');
            colorOption.style.backgroundColor = color;
            colorOption.classList.add('color-option');
            colorOption.addEventListener('click', function() {
                note.style.backgroundColor = color;
                colorPicker.style.display = 'none';
                saveNotes(); 
            });
            colorPicker.appendChild(colorOption);
        }
    
        note.appendChild(colorPicker);
    
        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('note-buttons');
    
        let changeColorButton = document.createElement('button');
        changeColorButton.textContent = '🌈';
        changeColorButton.addEventListener('click', function () {
            colorPicker.style.display = 'flex';
        });
        buttonsContainer.appendChild(changeColorButton);
    
        note.deleteTimeout = null;
    
        let deleteNoteButton = document.createElement('button');
        deleteNoteButton.textContent = '❌';
        deleteNoteButton.addEventListener('click', function () {
            if (noteTitle.style.textDecoration === 'line-through') {
                noteTitle.style.textDecoration = 'none';
                clearTimeout(note.deleteTimeout);
            } else {
                noteTitle.style.textDecoration = 'line-through';
                note.deleteTimeout = setTimeout(function () {
                    notesContainer.removeChild(note);
                    saveNotes();
                }, 3000);
            }
        });
        buttonsContainer.appendChild(deleteNoteButton);
    
        let addItemButton = document.createElement('button'); 
        addItemButton.textContent = '➕'; 
        addItemButton.addEventListener('click', function () {
            let item = createItem(note, '');
            note.appendChild(item);
            saveNotes();
        });
    
        buttonsContainer.appendChild(addItemButton);
    
        note.appendChild(buttonsContainer);
    
        for (let itemData of items) {
            let item = createItem(note, itemData.text); // Pass the note and the text
            item.getElementsByTagName('input')[0].checked = itemData.completed; // Set the completed status
            note.appendChild(item);
        }
    
        return note;
    }
    
    function updateNoteColorAndTitle(note, title) {
        let actualTitle = title;
        let colorToApply = "#333333";  // A cor padrão ou a última cor definida
    
        // Procurando um possível código de cor no título
        let match = title.match(/"#([0-9A-F]{6})"/i);
        if (match) {
            let possibleColor = match[1];
            if (/^[0-9A-F]{6}$/i.test(possibleColor)) {  
                colorToApply = '#' + possibleColor;
                actualTitle = title.replace(match[0], '').trim();
            }
        }
        
        note.style.backgroundColor = colorToApply;
        note.getElementsByTagName('h2')[0].textContent = actualTitle;
    }
    

    function loadNotes() {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        for (let note of notes) {
            let noteElement = createNote(note.title, note.color, note.items);
            notesContainer.appendChild(noteElement);
        }
    }
    
    function createItem(note, text) {
        let item = document.createElement('div');
        item.classList.add('item');

        let deleteItemButton = document.createElement('input');
        deleteItemButton.type = 'checkbox';
        item.deleteTimeout = null;

        deleteItemButton.addEventListener('change', function () {
            if (deleteItemButton.checked) {
                item.style.textDecoration = 'line-through';
                item.deleteTimeout = setTimeout(function () {
                    note.removeChild(item);
                    saveNotes();
                }, 3000);
            } else {
                item.style.textDecoration = 'none';
                clearTimeout(item.deleteTimeout);
            }
        });

        item.appendChild(deleteItemButton);

    let itemText = document.createElement('p');
    itemText.textContent = text || "     ";
    itemText.contentEditable = true;

    // Adicione este ouvinte de evento
    itemText.addEventListener('input', function() {
        saveNotes();
    });

    item.appendChild(itemText);

    setTimeout(() => {
        itemText.focus();
    }, 0);

    return item;
}

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    loadNotes(); // Carregando notas no fim
});
