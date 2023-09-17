document.addEventListener('DOMContentLoaded', function () {
    let isRecording = false;  // Flag para verificar se está gravando
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceButton = document.getElementById("voice-button");
    const noteInput = document.getElementById("note-input");

    if (!voiceButton || !noteInput) {
        console.error("Elementos necessários não encontrados.");
        return;
    }

    if (!SpeechRecognition) {
        console.error("Navegador não suporta a API.");
        voiceButton.style.opacity = "0.2";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    voiceButton.addEventListener("click", function () {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
        } else {
            recognition.start();
            isRecording = true;
        }
    });

    recognition.addEventListener("result", function (event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("");
        noteInput.value += transcript + ' ';
    });

    recognition.addEventListener("error", function(event) {
        console.error("Erro: ", event);
    });

    recognition.addEventListener("end", function() {
        if (isRecording) {
            recognition.start(); // Reiniciar a gravação se ainda estiver gravando
        }
    });
});
