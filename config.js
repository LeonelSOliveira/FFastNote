// BOTÃO DE CONFIGURAÇÃO

// Obter o botão de configuração e o painel de configurações
const configButton = document.getElementById('config');
const settingsPanel = document.getElementById('settings-panel');

// Função para alternar a visibilidade do painel de configurações
function toggleSettingsPanel() {
    if (settingsPanel.classList.contains('settings-hidden')) {
        settingsPanel.classList.remove('settings-hidden');
        settingsPanel.classList.add('settings-visible');
    } else {
        settingsPanel.classList.remove('settings-visible');
        settingsPanel.classList.add('settings-hidden');
    }
}

// Adicionar evento de clique ao botão de configuração
configButton.addEventListener('click', toggleSettingsPanel);







//BOTÃO DE ALTERAR COR

// Cores base para o fundo no formato RGB
const colors = [
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 255, b: 255 },
    { r: 128, g: 0, b: 128 },
    { r: 255, g: 192, b: 203 },
    { r: 255, g: 255, b: 255 },
    { r: 38, g: 38, b: 38 }
  ];
  let currentColorIndex = 0;
  let brightnessMode = 'pastel';
  
  // Carregar configurações salvas
  if (localStorage.getItem('currentColorIndex')) {
    currentColorIndex = Number(localStorage.getItem('currentColorIndex'));
    brightnessMode = localStorage.getItem('brightnessMode');
    const initialColor = adjustBrightness(colors[currentColorIndex]);
    const darkerInitialColor = darkenByPercentage(initialColor, 0.2); // 20% mais escuro
    document.body.style.backgroundColor = rgbToCss(initialColor);
    document.querySelector('.input-wrapper').style.backgroundColor = rgbToCss(darkerInitialColor);
  }
  
  // Função para ajustar a tonalidade da cor
  function adjustBrightness(color) {
    if (brightnessMode === 'dark') return darkenColor(color);
    return makePastel(color);
  }
  
  // Função para escurecer a cor
  function darkenColor(color) {
    return {
      r: Math.floor(color.r * 0.3),
      g: Math.floor(color.g * 0.3),
      b: Math.floor(color.b * 0.3)
    };
  }
  
  // Função para criar uma versão pastel da cor
  function makePastel(color) {
    return {
      r: Math.min(255, Math.floor(color.r + (255 - color.r) * 0.5)),
      g: Math.min(255, Math.floor(color.g + (255 - color.g) * 0.5)),
      b: Math.min(255, Math.floor(color.b + (255 - color.b) * 0.5))
    };
  }
  
  // Função para escurecer uma cor por uma porcentagem
  function darkenByPercentage(color, percentage) {
    return {
      r: Math.floor(color.r * (1 - percentage)),
      g: Math.floor(color.g * (1 - percentage)),
      b: Math.floor(color.b * (1 - percentage))
    };
  }
  
  // Função para converter RGB para formato de string CSS
  function rgbToCss(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Botão para mudar a cor
    document.getElementById("color-button").addEventListener("click", function() {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
      const newColor = adjustBrightness(colors[currentColorIndex]);
      const darkerColor = darkenByPercentage(newColor, 0.2); // 20% mais escuro
      document.body.style.backgroundColor = rgbToCss(newColor);
      document.querySelector('.input-wrapper').style.backgroundColor = rgbToCss(darkerColor);
  
      // Salvar configurações
      localStorage.setItem('currentColorIndex', currentColorIndex);
      localStorage.setItem('brightnessMode', brightnessMode);
    });
  
    // Botão para ajustar o brilho
    document.getElementById("brightness-button").addEventListener("click", function() {
      if (brightnessMode === 'dark') brightnessMode = 'pastel';
      else if (brightnessMode === 'pastel') brightnessMode = 'dark';
  
      const newColor = adjustBrightness(colors[currentColorIndex]);
      const darkerColor = darkenByPercentage(newColor, 0.2); // 20% mais escuro
      document.body.style.backgroundColor = rgbToCss(newColor);
      document.querySelector('.input-wrapper').style.backgroundColor = rgbToCss(darkerColor);
  
      // Salvar configurações
      localStorage.setItem('currentColorIndex', currentColorIndex);
      localStorage.setItem('brightnessMode', brightnessMode);
    });
  });
  
