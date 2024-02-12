import { CLIAutomationQuestionInterface } from "../interface/question.interface.js";
/**
 * @description questions list for automation generation
 * @param {CLIAutomationQuestionInterface} automationQuestionParams included the script arguments and needed package states
 * @returns {Promise<any>}
 */
export declare const CLIAutomationQuestion: (automationQuestionParams: CLIAutomationQuestionInterface) => Promise<any>;
/**
 * @description questions list for json selected options
 * @param {any} answers options
 * @returns {Promise<any>}
 */
export declare const CLIJSONQuestion: (answers: any) => Promise<any>;
/**
 * @description questions list for environment generation
 * @returns {Promise<any>}
 */
export declare const CLIEnvironmentQuestion: () => Promise<any>;
