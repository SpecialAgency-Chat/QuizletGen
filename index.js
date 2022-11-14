/** @type {import("puppeteer-extra").PuppeteerExtra} */
const puppeteer = require("puppeteer-extra");
const { executablePath } = require("puppeteer");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {default:axios} = require("axios");
const randomWords = require("random-words");

puppeteer.use(StealthPlugin());

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {

const browser = await puppeteer.launch({
  headless: false,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  executablePath: executablePath(),
  slowMo: 100
});

const m = `${randomWords({exactly: 1, join: ""})}${randint(11111, 99999)}@gmail.com`;

const page = await browser.newPage();
await page.goto("https://quizlet.com/");
await page.waitForSelector("button[aria-label='Sign up']");
await page.click("button[aria-label='Sign up']");
await page.waitForSelector("select[name=birth_month]");
await page.select("select[name=birth_month]", `${randint(1,12)}`);
await page.select("select[name=birth_day]", `${randint(1,28)}`);
await page.select("select[name=birth_year]", `${randint(1970,2000)}`);
await page.type("input#email", m);
await page.type("input#password1", `Abcd1234!`);
await page.click("input[name=TOS]");
await page.click("button[type=submit]");
await new Promise(resolve => setTimeout(resolve, 3000));
await page.waitForSelector("body");
if (page.url() !== "https://quizlet.com/") {
console.log("Created");
console.log(m);
await browser.close();
process.exit(0);
} else {
console.log("Failed");
await browser.close();
process.exit(1);
}

})();