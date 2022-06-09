import {
    Options as ScreenshotOptions,
    screenshot as takeScreenshot,
} from '@prokopschield/website-screenshot';

export interface Screenshot {
    /**
     * screenshots.full -> screenshot of full page
     * screenshots[resolution] -> screenshot with given resolution
     */
    screenshots: Record<string, Buffer>;
    /** resources[URL] -> Buffer */
    resources: Record<string, Buffer>;
    /** size of all resources loaded */
    size: number;
    /** total page load time */
    load_time_ms: number;
    /** set of URLs accessed */
    URLs: Set<string>;
    /** fully rendered page HTML */
    html: string;
    /** an Error, if any occured */
    error?: Error;
}

/**
 * Create a screenshot of a webpage
 * @param url e.g. https://luc.computer
 * @param resolutions e.g. ['1920x1080', '1200x900']
 * @param options { imgFormat: 'webp' | 'jpeg' | 'png', imgQuality: number between 1 and 100 }
 * @returns the rendered screenshots + metadata
 */
export const screenshot = async (
    url: string,
    resolutions: string[],
    options: ScreenshotOptions = {}
): Promise<Screenshot> => {
    const preview = await takeScreenshot(
        url,
        // resolutions are mapped from 'WIDTHxHEIGHT' to { x: WIDTH, y: HEIGHT }
        resolutions.map((resolution: string) => {
            const [x, y] = resolution.split('x');

            return {
                x: Number(x),
                y: Number(y),
            };
        }),
        options
    );

    return {
        ...preview,
        screenshots: Object.fromEntries(preview.screenshots.entries()),
        resources: Object.fromEntries(preview.resources.entries()),
    };
};
