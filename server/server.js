const express = require("express");
const app = express();
const port = 3000; // Choisissez le port que vous souhaitez utiliser
const cors = require("cors"); // Importez le module 'cors'
const fs = require("fs"); // Importez le module 'fs' pour lire le fichier

app.use(cors({ origin: "http://127.0.0.1:5500" }));

app.get("/", (req, res) => {
  fs.readFile("items.json", "utf8", (err, data) => {
    // Lisez le fichier 'data.json'
    if (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la lecture du fichier"); // Gestion des erreurs
    } else {
      res.json(JSON.parse(data)); // Envoyez le contenu du fichier en tant que JSON
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
