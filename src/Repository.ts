import sample from './model/sample';
import _ from 'lodash';
import fs from 'fs';
import shortid from 'shortid';
import ValidationError from './ValidationError';

export default class Repository {
    private data: IRecordDictionary;

    constructor(private filePath: string) {
        console.log(`Using file ${filePath} as data storage`);
        this.loadData();
    }

    public getRecords(): IRecordInList[] {
        return _(this.data)
            .values()
            .map((r) => _.pick(r, ['id', 'name', 'type', 'yearOfRelease', 'starring', 'genre', 'rating']))
            .valueOf() as IRecordInList[];
    }

    public getRecordById(id: string): IRecord|undefined {
        return this.data[id];
    }

    public validateCreate(r: IRecord): ValidationError|void {
        if (!_.isObject(r)) {
            return new ValidationError(400, 'Expeting create call to contain record in request body.');
        }
        if (!_.isUndefined(r.id)) {
            return new ValidationError(400, 'New record should not have id. Perhaps you wanted to call update instead?');
        }
    }

    public createRecord(r: IRecord): IRecord {
        r.id = shortid.generate();
        this.data[r.id] = r;
        this.saveData();
        return r;
    }

    public validateUpdate(r: IRecord): ValidationError|void {
        if (!_.isObject(r)) {
            return new ValidationError(400, 'Expeting update call to contain record in request body.');
        }
        if (!_.isString(r.id)) {
            return new ValidationError(400, 'Updating record requires the record to have an id. Perhaps you wanted to call create instead?');
        }
        if (!this.data[r.id]) {
            return new ValidationError(400, `Cannot update record with id ${r.id} because it does not exist in the repository.`);
        }
    }

    public updateRecord(r: IRecord): IRecord {
        this.data[r.id] = r;
        this.saveData();
        return r;
    }

    public validateDelete(id: any): ValidationError|void {
        if (!_.isString(id)) {
            return new ValidationError(400, `Expecting delete request to have body with object with id property of type string.`);
        }
        if (!this.data[id]) {
            return new ValidationError(400, `Cannot delete record with id ${id} because it does not exist in the repository.`);
        }
    }

    public deleteRecord(id: string): void {
        delete this.data[id];
        this.saveData();
    }

    private loadData(): void {
        try {
            const dataAsJson = fs.readFileSync(this.filePath, { encoding: 'utf8'});
            this.data = JSON.parse(dataAsJson);
        } catch (err) {
            console.error(`Failed to load or parse file ${this.filePath}. Using sample data instead.`);
            this.data = sample;
            this.saveData();
        }
    }

    private saveData(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4));
    }
}