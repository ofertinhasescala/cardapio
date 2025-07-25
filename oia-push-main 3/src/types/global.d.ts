/// <reference types="@types/google.maps" />

// Adiciona o objeto google ao objeto window
declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
} 