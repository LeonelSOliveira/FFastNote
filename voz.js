document.addEventListener('DOMContentLoaded', function () {
    // Inicializando o reconhecimento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Elementos da interface
    const voiceButton = document.getElementById("voice-button");
    const noteInput = document.getElementById("note-input");

    if(!voiceButton || !noteInput) {
        console.error("Elementos necessários para a transcrição de voz não encontrados.");
        return;
    }
    
    if (!SpeechRecognition) {
        console.error("O navegador não suporta a API de reconhecimento de voz.");
        voiceButton.style.opacity = "0.2";  // Torna o botão mais transparente se a API não estiver disponível
        return;
    }

    let isRecording = false;  // Flag para verificar se está gravando
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; // Define o idioma para Português do Brasil

    // Eventos para o botão de voz
    voiceButton.addEventListener("mousedown", function () {
        isRecording = true;
        recognition.start();  // Inicia o reconhecimento de voz
    });

    voiceButton.addEventListener("mouseup", function () {
        isRecording = false;
        recognition.stop();  // Finaliza o reconhecimento de voz
    });

    // Eventos para o reconhecimento de voz
    recognition.addEventListener("result", function (event) {
        if (isRecording) {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join("");
            noteInput.value = transcript; // Insere o texto reconhecido no campo de entrada
        }
    });

    // Evento para tratamento de erros
    recognition.addEventListener("error", function(event) {
        console.error("Erro no reconhecimento de voz: ", event);
    });
});
