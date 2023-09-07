document.addEventListener('DOMContentLoaded', function () {
    // Inicializando o reconhecimento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) {
        console.error("O navegador não suporta a API de reconhecimento de voz.");
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; // Define o idioma para Português do Brasil

    // Elementos da interface
    const voiceButton = document.getElementById("voice-button");
    const noteInput = document.getElementById("note-input");

    if(!voiceButton || !noteInput) {
        console.error("Elementos necessários para a transcrição de voz não encontrados.");
        return;
    }

    // Eventos para o botão de voz
    voiceButton.addEventListener("click", function () {
        recognition.start();
    });

    // Eventos para o reconhecimento de voz
    recognition.addEventListener("result", function (event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("");
        noteInput.value = transcript; // Insere o texto reconhecido no campo de entrada
    });

    // Evento para tratamento de erros
    recognition.addEventListener("error", function(event) {
        console.error("Erro no reconhecimento de voz: ", event);
    });
});
