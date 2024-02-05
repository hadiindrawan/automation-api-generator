export declare class PogenCommand {
    private scriptArg?;
    constructor(scriptArg?: string);
    initiation: () => Promise<{
        [key: string]: string | boolean | string[];
    }>;
    automation: () => Promise<void>;
    environment: () => Promise<void>;
}
