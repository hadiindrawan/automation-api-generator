export interface CLIAutomationQuestionInterface {
    argument: string | undefined;
    packagesList: boolean | string[] | string;
    mochaExist: boolean | string[] | string;
    eslintExist: boolean | string[] | string;
}
