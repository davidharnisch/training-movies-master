"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sample_1 = __importDefault(require("./model/sample"));
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const shortid_1 = __importDefault(require("shortid"));
const ValidationError_1 = __importDefault(require("./ValidationError"));
class Repository {
    constructor(filePath) {
        this.filePath = filePath;
        console.log(`Using file ${filePath} as data storage`);
        this.loadData();
    }
    getRecords() {
        return lodash_1.default(this.data)
            .values()
            .map((r) => lodash_1.default.pick(r, ['id', 'name', 'type', 'yearOfRelease', 'starring', 'genre', 'rating']))
            .valueOf();
    }
    getRecordById(id) {
        return this.data[id];
    }
    validateCreate(r) {
        if (!lodash_1.default.isObject(r)) {
            return new ValidationError_1.default(400, 'Expeting create call to contain record in request body.');
        }
        if (!lodash_1.default.isUndefined(r.id)) {
            return new ValidationError_1.default(400, 'New record should not have id. Perhaps you wanted to call update instead?');
        }
    }
    createRecord(r) {
        r.id = shortid_1.default.generate();
        this.data[r.id] = r;
        this.saveData();
        return r;
    }
    validateUpdate(r) {
        if (!lodash_1.default.isObject(r)) {
            return new ValidationError_1.default(400, 'Expeting update call to contain record in request body.');
        }
        if (!lodash_1.default.isString(r.id)) {
            return new ValidationError_1.default(400, 'Updating record requires the record to have an id. Perhaps you wanted to call create instead?');
        }
        if (!this.data[r.id]) {
            return new ValidationError_1.default(400, `Cannot update record with id ${r.id} because it does not exist in the repository.`);
        }
    }
    updateRecord(r) {
        this.data[r.id] = r;
        this.saveData();
        return r;
    }
    validateDelete(id) {
        if (!lodash_1.default.isString(id)) {
            return new ValidationError_1.default(400, `Expecting delete request to have body with object with id property of type string.`);
        }
        if (!this.data[id]) {
            return new ValidationError_1.default(400, `Cannot delete record with id ${id} because it does not exist in the repository.`);
        }
    }
    deleteRecord(id) {
        delete this.data[id];
        this.saveData();
    }
    loadData() {
        try {
            const dataAsJson = fs_1.default.readFileSync(this.filePath, { encoding: 'utf8' });
            this.data = JSON.parse(dataAsJson);
        }
        catch (err) {
            console.error(`Failed to load or parse file ${this.filePath}. Using sample data instead.`);
            this.data = sample_1.default;
            this.saveData();
        }
    }
    saveData() {
        fs_1.default.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4));
    }
}
exports.default = Repository;
