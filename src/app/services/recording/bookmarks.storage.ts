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

    clearAll():void {
        this._bookmarks.length = 0;
    }
}
