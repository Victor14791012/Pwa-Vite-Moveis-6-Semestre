// Registrando o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
        console.log('Service Worker registrado com sucesso:', reg);
      } catch (err) {
        console.error('Falha ao registrar o Service Worker:', err);
      }
    });
  }
  