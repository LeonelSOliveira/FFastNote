document.addEventListener('DOMContentLoaded', function () {
    let notesContainer = document.getElementById('notes-container');
    let newNoteInput = document.getElementById('note-input');
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];

    newNoteInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && this.value.trim() !== '') {
            let newNote = createNote(this.value);
            this.value = '';
            notesContainer.appendChild(newNote);
            saveNotes();
        }
    });
    


// Função para criar uma nota
    function createNoteAndAppend(value) {
        if (value.trim() !== '') {
            let newNote = createNote(value);
            notesContainer.appendChild(newNote);
            saveNotes();
        }
    }
    
    // Adicionando evento de clique ao botão "💭"
    document.querySelector('button[type="brain"]').addEventListener('click', function() {
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
        let parts = title.split('|');
        let actualTitle = parts[0].trim();  // Título real
        let extraInfo = parts[1]?.trim();  // Informação extra, se houver

        // Processando cor
        if (extraInfo && extraInfo.startsWith("cor#")) {
            let possibleColor = extraInfo.substr(4, 6); // Pegando os 6 próximos caracteres como possíveis códigos de cores

            if (/^#[0-9A-F]{6}$/i.test('#' + possibleColor)) { // Verificando se é um código de cor válido
                color = '#' + possibleColor;
            }
        }

        note.style.backgroundColor = color;

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
