// peoplestrong-punchin.js
import puppeteer from "puppeteer";
import { read } from "image-js";
/**
 * Compare deux images et renvoie la position (x, y)
 * où la sous-image (template) correspond le mieux à la grande image (screen).
*/

const USERNAME = "AMAA9000002356"; // ton ID PeopleStrong
const PASSWORD = "Test@2025"; // ton mot de passe
const LOGIN_URL = "https://cieltextile.peoplestrong.com/altLogin.jsf";
const INACTIVITY_DELAY = 4000;

let btn_new_leave = false;
let form = false;

async function setDate(page, selector, value) {
  await page.evaluate((selector, value) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.removeAttribute('disabled');
    el.value = value;

    // Simuler changement Angular
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function detectTemplate(screenPath, templatePath, threshold = 0.8) {
  const screen = await read(screenPath);
  const template = await read(templatePath);

  // Convertir en niveaux de gris pour simplifier la comparaison
  const screenGray = screen.grey();
  const templateGray = template.grey();

  const { width: w, height: h } = templateGray;
  let bestScore = 0;
  let bestPos = null;

  // Parcours simplifié : pas de pixel-perfect, mais rapide
  for (let y = 0; y <= screenGray.height - h; y += 4) {
    for (let x = 0; x <= screenGray.width - w; x += 4) {
      const region = screenGray.crop({ x, y, width: w, height: h });

      const pixelsRegion = region.getPixel();
      const pixelsTemplate = templateGray.getPixel();

      // Calcul de la différence moyenne entre les pixels
      let diffSum = 0;
      for (let i = 0; i < pixelsRegion.length; i++) {
        diffSum += Math.abs(pixelsRegion[i] - pixelsTemplate[i]);
      }

      const meanDiff = diffSum / pixelsRegion.length;
      const score = 1 - meanDiff / 255; // 1 = identique

      if (score > bestScore) {
        bestScore = score;
        bestPos = { x, y };
      }
    }
  }

  console.log("🔍 Score max:", bestScore.toFixed(3));

  if (bestScore >= threshold) {
    return bestPos;
  } else {
    throw new Error("Aucune correspondance trouvée (score trop faible)");
  }
}

async function connect(page) {
  await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });

  console.log("🔗 Ouverture du site...");

  // Remplir le formulaire de connexion
  console.log("✏️ Remplissage du formulaire...");
  await page.$eval('#loginForm\\:username12', el => el.value = '');
  await page.type("#loginForm\\:username12", USERNAME, { delay: 80 });
  await page.type("#loginForm\\:password", PASSWORD, { delay: 80 });

  // Cliquer sur le bouton Login
  console.log("🚀 Connexion...");
  await Promise.all([
    page.click("#loginForm\\:loginButton"),
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  ]);

  // Attente que la page principale charge (vérifie un élément spécifique du tableau de bord)
  console.log("✅ Connecté avec succès !");  
}

async function punchInOut(page) {
  await page.mouse.click(870, 170);
}
const INACTIVITY_TIMEOUT = 5000; // 3 secondes sans message

const onConsoleStop = async (page) => {
  console.log(`🛑 Plus de messages détectés depuis ${INACTIVITY_TIMEOUT/1000}s.`);
  await page.mouse.click(370, 250);

};

async function newLeave(page) {
  let inactivityTimer;
  const newPagePromise = new Promise(resolve =>
    page.browser().once('targetcreated', async target => {
      const newPage = await target.page();
      resolve(newPage);
    })
  );

  // await page.mouse.move(40, 210)
  await page.mouse.click(340, 460);
  // await delay(2000);
  const newPage = await newPagePromise;
  await delay(2000);
  // await page.mouse.click(370, 250);
  await delay(2000);
  console.log("🕒 Navigation vers Congé...");
  var i = 0;
  var test = false;
  newPage.on("console", async (msg) => {
    console.log('💬 Console:', msg.text());
  // Reset du timer
    clearTimeout(inactivityTimer);

    // Recréer un timer qui déclenchera l'action après période d'inactivité
    inactivityTimer = setTimeout(async () => {
      console.log("⏳ Plus aucun message console → on continue");

      // === Ton action ici ===
      if (!btn_new_leave) {
        await newPage.waitForSelector('button.btn.btn-default', { visible: true });
        await newPage.evaluate(() => {
          const btn = [...document.querySelectorAll('button.btn.btn-default')]
            .find(b => b.textContent.trim() === 'New Leave');
          if (btn){ btn.click(); };
        });
      }

      if (!form) {
        console.log("WE NEED TO COMPLETE FORMS !!!!");
        await delay(2000);
        // await newPage.$eval('#leaveComment', el => el.value = '');

        await newPage.waitForSelector('input[placeholder="Comment"]', { visible: true });
        await newPage.evaluate(() => {
          const el = document.querySelector('input[placeholder="Comment"]');
          el.value = "";
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await newPage.type('input[placeholder="Comment"]', 'Just a test for Puppeteer automation!', { delay: 100 });
        

        // await newPage.evaluate(() => {
        //   const el = document.querySelector('#leaveComment');
        //   if (el) {
        //     el.value = "";
        //     el.dispatchEvent(new Event('input', { bubbles: true }));
        //   }
        // });
        // await newPage.type('#leaveComment', 'Made by Puppeteer', { delay: 100 });
        await delay(2000);
        await newPage.mouse.click(160,240)
        await delay(2000);
        await newPage.mouse.click(140,340)
        await delay(2000);
        // await page.click('#startDate');
        console.log("STARTING DATE NOW !!!");
        await setDate(newPage,"#startDate", '11/13/2025')
        await delay(2000);
        console.log("ENDING DATE NOW !!!");
        await setDate(newPage,"#endDate", '11/14/2025')
        await delay(4000);
        await newPage.click('button[title="Submit"]');
        form = true;
        await delay(4000);
        return;
      }
      
      console.log("✅ Bouton 'New Leave' cliqué");

    }, INACTIVITY_DELAY);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // true si tu veux en arrière-plan
    defaultViewport: null,
    userDataDir: "./one-hr",
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(true);
  await connect(page);

  // Aller sur la page Punch In (tu peux adapter l’URL si besoin)
  console.log("🕒 Navigation vers Punch In...");

    const screenshotPath = "screenshot.png";
    page.on("console", async (msg) => {
      const text = msg.text();
      console.log("[Console] →", text);

      // Si le message contient "_getErrorMessage()"
      if (text.includes("_getErrorMessage()")) {
        await delay(5000);
        // await page.screenshot({ path: screenshotPath, fullPage: true });
        // console.log("📸 Capture sauvegardée !");
        // const position = await detectTemplate(screenshotPath, "punch-in.png");
        // await punchInOut(page)
        await newLeave(page);
        // await browser.close();
      }
    });
})();
