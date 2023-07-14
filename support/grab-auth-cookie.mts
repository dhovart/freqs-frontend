import { Response, chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import cookieParser from 'tough-cookie';

async function main() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await browser.newPage();
    await page.goto("http://localhost:8080/oauth2/authorization/spotify");

    const redirectUrl = await page.evaluate(() => {
        const body = document.querySelector('body');
        if (body) {
            const json = JSON.parse(body.innerText);
            return json.redirectUrl;
        }
        return null;
    });

    await page.goto(redirectUrl);

    const response = await page.waitForResponse(/\/login\/oauth2\/code/)
    await saveAuthCookieToFile(response)
    browser.close()
}

async function saveAuthCookieToFile(response: Response) {
    let setCookie = (await response.allHeaders())?.['set-cookie']
    if (!setCookie) throw Error('No cookies were set');
    let match = setCookie.match(/auth=.*$/m)?.[0];
    if (!match) throw Error('No cookies named auth in the response');
    const cookie = cookieParser.parse(match)?.toJSON()
    if (!cookie) throw Error('Could not parse cookies');
    await fs.writeFile(path.resolve('support', 'cookie.json'), JSON.stringify(cookie));
}

main().catch(console.error);
