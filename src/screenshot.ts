import Pageres from 'pageres';

const defaultResolution: string[] = ['1200x900', '1920x1080'];
const defaultDelay: number = 2;

export const screenshot = async (
    url: string,
    resolutions?: string[],
    delay?: number
): Promise<Record<string, string>> => {
    if (!resolutions) resolutions = defaultResolution;

    if (!delay) delay = defaultDelay;

    const buffers = await new Pageres({ delay, crop: true })
        .src(url, resolutions)
        .run();

    const output: Record<string, string> = {};

    let index = 0;

    for (const buffer of buffers) {
        // eslint-disable-next-line unicorn/prefer-at
        output[resolutions[index]] = buffer.toString('binary');

        index++;
    }

    return output;
};
