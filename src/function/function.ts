import { Page } from "puppeteer";

async function connect(page: Page, loginUrl: string, username: string, password: string) {
  await page.goto(loginUrl, { waitUntil: "domcontentloaded" });

  console.log("🔗 Ouverture du site...");

  // Remplir le formulaire de connexion
  console.log("✏️ Remplissage du formulaire...");
  console.log("USERNAME:", username);
  console.log("PASSWORD:", password);
  
  await page.$eval('#loginForm\\:username12', (el:HTMLInputElement) => el.value = '');
  await page.type("#loginForm\\:username12", username, { delay: 80 });
  await page.type("#loginForm\\:password", password, { delay: 80 });

  // Cliquer sur le bouton Login
  console.log("🚀 Connexion...");
  await Promise.all([
    page.click("#loginForm\\:loginButton"),
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  ]);

  // Attente que la page principale charge (vérifie un élément spécifique du tableau de bord)
  console.log("✅ Connecté avec succès !");  
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setDate(page: Page, selector: string, value: string) {
  await page.evaluate((selector, value) => {
    const el:HTMLInputElement = document.querySelector(selector);
    if (!el) return;
    el.removeAttribute('disabled');
    el.value = value;

    // Simuler changement Angular
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

export {
    connect,
    delay,
    setDate
}