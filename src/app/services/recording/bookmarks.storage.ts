import { Injectable } from '@angular/core';
import { Bookmark } from '../../models/bookmark.factory';

@Injectable()
export class BookmarksStorage {

    private _bookmarks = [];

    get bookmarks(): any {
        return this._bookmarks;
    }

    addBookmark(bookmark: Bookmark): void {
        this._bookmarks.push(bookmark);
    }

    setProcessedAudioData(base64AudioData) {
        this._bookmarks.forEach((bookmark) => {
            bookmark.base64AudioData = base64AudioData;
        })
    }

    clearAll():void {
        this._bookmarks.length = 0;
    }
}
