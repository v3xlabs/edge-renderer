export const processJob = async (task: string) => {
    console.log('processingJob', task);
    await new Promise<void>((accumulator) => {
        setTimeout(accumulator, 2000);
    });
};
