import * as _find from 'lodash/find';

export class RecordingStorage {

    private _recordings = [];

    put (record: any): void {
        this._recordings.push(record);
    }
    get (id: string): any {
        let result = null;

        return _find(this._recordings, (rec) => {
            return rec.id == id;
        });
    }
    getAll(): Array<any> {
        return null;
    }
}
