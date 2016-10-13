import { Injectable } from '@angular/core';

export class ProcessedRecord {

    private _bookmarks = [];

    constructor() { }

    setTrack(track: any):void {

    }
    addBookmark(start: number, end: number, text: string): void {

    }

}

@Injectable()
export class ProcessedRecordFactory {

    create() {
        return new ProcessedRecord();
    }

}
