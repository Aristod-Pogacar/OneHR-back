import { read } from 'image-js';
import fs from 'fs';

async function detectTemplate(screenPath, templatePath, threshold = 0.8) {
  // 1️⃣ Charger les images
  const screen = await read(screenPath);
  const template = await read(templatePath);

  // 2️⃣ Convertir en niveaux de gris
  const screenGray = screen.grey();
  const templateGray = template.grey();

  const { width: w, height: h } = templateGray;

  let bestScore = 0;
  let bestPosition = null;

  // 3️⃣ Balayer l'image principale
  for (let y = 0; y <= screenGray.height - h; y++) {
    for (let x = 0; x <= screenGray.width - w; x++) {
        const region = screenGray.crop({ x, y, width: w, height: h });
        
        // Calcul du score de similarité basé sur la différence moyenne des pixels
        const diff = region
        .subtract(templateGray, { absolute: true })
        .mean(); // moyenne de la différence absolue
        
        const score = 1 - diff / 255; // normalisation 0–1 (1 = identique)
        console.log("x:"+x, "y:"+y+";", "Diff:"+diff, "Score:"+score, "Region:"+region);
        
      if (score > bestScore) {
        bestScore = score;
        bestPosition = { x, y };
      }
    }
  }

  // 5️⃣ Vérifier si la correspondance dépasse le seuil
  if (bestScore >= threshold) {
    console.log(`✅ Modèle trouvé à x=${bestPosition.x}, y=${bestPosition.y} (score=${bestScore.toFixed(3)})`);
    // 6️⃣ Enregistrer les coordonnées dans un fichier JSON
    fs.writeFileSync(
      'coordinates.json',
      JSON.stringify({ ...bestPosition, score: bestScore }, null, 2)
    );
    return bestPosition;
  } else {
    console.log("❌ Modèle non trouvé (aucune correspondance suffisante)");
    return null;
  }
}

// Exemple d'utilisation :
const coord = detectTemplate('screenshot.png', 'punch-in.png', 0.65);
console.log("Coordonnées:", coord);