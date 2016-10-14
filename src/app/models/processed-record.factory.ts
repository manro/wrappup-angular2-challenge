import { Injectable } from '@angular/core';
import { Bookmark } from './bookmark.factory';

export class ProcessedRecord {

    private _bookmarks = [];

    constructor() { }

    get bookmarks():any {
        return this._bookmarks;
    }

    setTrack(track: any):void {

    }
    addBookmark(bookmark: Bookmark): void {

    }

}

@Injectable()
export class ProcessedRecordFactory {

    create() {
        return new ProcessedRecord();
    }

}
