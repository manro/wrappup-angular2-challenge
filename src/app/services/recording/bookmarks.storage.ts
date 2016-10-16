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
    removeBookmark(id:string):void {
        let len = this._bookmarks.length;
       for (let i = 0; i < len; i++) {
           let bm = this._bookmarks[i];
           if (bm.id === id) {
               this._bookmarks.splice(i, 1);
               return;
           }
       }
    }

    clearAll():void {
        this._bookmarks.length = 0;
    }
}
