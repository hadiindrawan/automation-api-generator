import { devPackageInstallInterface, packageInstallInterface } from '../interface/package.interface.js';
/**
 * @description package execution
 * @param {packageInstallInterface} packageInterface included packacge, json file, and module type
 * @returns {Promise<void>}
 */
export declare const installPackage: (packageInterface: packageInstallInterface) => Promise<void>;
/**
 * @description dev package execution
 * @param {devPackageInstallInterface} devPackageInterface included packacge, json file, and module type
 * @returns {Promise<void>}
 */
export declare const installDevPackge: (devPackageInterface: devPackageInstallInterface) => Promise<void>;
