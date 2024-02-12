export interface packageInstallInterface {
    stringPackage: boolean | string[] | string,
    stringDevPackage: string,
    jsonfile: any,
    moduleType: string,
    prettierExist: boolean | string[] | string,
}
export interface devPackageInstallInterface {
    stringDevPackage: boolean | string[] | string,
    jsonfile: any,
    moduleType: string,
    prettierExist: boolean | string[] | string,
}