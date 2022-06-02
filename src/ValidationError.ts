export default class ValidationError {
    constructor(public httpStatus: number, public message: string) {}

    public getErrorObj(): {error: string} {
        return { error: this.message };
    }
}