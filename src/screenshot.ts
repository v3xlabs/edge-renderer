import puppeteer from 'puppeteer';

const defaultResolution: string[] = ['1200x900', '1920x1080'];
const defaultDelay: number = 2;

export const screenshot = async (
    url: string,
    resolutions?: string[],
    delay?: number
): Promise<Record<string, string>> => {
    if (!resolutions) resolutions = defaultResolution;

    if (!delay) delay = defaultDelay;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle0',
    });

    const output: Record<string, string> = {};

    for (const resolution of resolutions) {
        const [width, height] = resolution.split('x').map(Number);

        await page.setViewport({ width, height });

        const buffer = (await page.screenshot({
            type: 'webp',
            encoding: 'binary',
            fullPage: false,
        })) as Buffer;

        output[resolution] = buffer.toString('binary');
    }

    // for (const buffer of buffers) {
    //     // eslint-disable-next-line unicorn/prefer-at
    //     output[resolutions[index]] = buffer.toString('binary');

    //     index++;
    // }

    return output;
};
