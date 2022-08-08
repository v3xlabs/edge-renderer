import puppeteer from 'puppeteer';
import sharp from 'sharp';

const defaultResolution: string[] = ['1200x900', '1920x1080'];
const defaultDelay: number = 2;

const chrome_path = process.env.CHROME_PATH;

export type JobData = {
    id: string;
    url: string;
    viewport: `${number}x${number}`;
    scales: `${number}`[];
};

const blacklist_networks = [/localhost(:.*)?/];

export const screenshot = async (
    job: JobData
): Promise<Record<string, string | Buffer>> => {
    // if (!resolutions) resolutions = defaultResolution;

    // if (!delay) delay = defaultDelay;

    const browser = await puppeteer.launch(
        chrome_path
            ? {
                  executablePath: chrome_path,
                  args: ['--no-sandbox'],
              }
            : {}
    );

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (interceptedRequest) => {
        if (
            blacklist_networks.some((network) =>
                new URL(interceptedRequest.url()).host.match(network)
            )
        ) {
            interceptedRequest.abort();
        } else {
            interceptedRequest.continue();
        }
    });

    await page.goto(job.url, {
        waitUntil: 'networkidle0',
    });

    const output: Record<string, string | Buffer> = {};

    const [width, height] = job.viewport.split('x').map(Number);
    const ratio = height / width;

    await page.setViewport({ width, height });

    const buffer = await page.screenshot({
        type: 'webp',
        encoding: 'binary',
        fullPage: false,
    });

    output['root'] = buffer;

    for (const resizeScale of job.scales) {
        const scaleW = Number.parseInt(resizeScale);
        const scaleH = Math.floor(scaleW * ratio);

        const data = await sharp(buffer).resize(scaleW, scaleH).toBuffer();

        output[scaleW] = data;
    }

    // for (const buffer of buffers) {
    //     // eslint-disable-next-line unicorn/prefer-at
    //     output[resolutions[index]] = buffer.toString('binary');

    //     index++;
    // }

    await page.close();
    await browser.close();

    return output;
};
