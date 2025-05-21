setTimeout(() => {
    server.close(() => {
      console.log('Serveur arrêté automatiquement après 10 secondes.');
      process.exit(0); // Facultatif : quitte le processus Node
    });
