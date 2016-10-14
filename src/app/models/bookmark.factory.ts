import { AppConstants } from '../constants/app.constants';
import { Utils } from '../services/utils/utils';

export class Bookmark {
    text:string;
    type:string = AppConstants.bookmark.type.note;

    start: number; //bytes count
    end: number; //bytes count

    private _base64AudioData = null; //future

    private _onProcessed = null;

    get startTime() {
        return (
            Utils.formatTimeDuration(
                Utils.bytesToMilliseconds(this.start)
            )
        )
    }

    get endTime() {
        return (
            Utils.formatTimeDuration(
                Utils.bytesToMilliseconds(this.end)
            )
        )
    }

    set base64AudioData(val:string) {
        this._base64AudioData = val;

        this._onProcessed && this._onProcessed();
    }

    get base64AudioData():string {
        return this._base64AudioData ;
    }

    subscribeOnProcessed(cb):void {
        if (typeof cb === 'function') {
            this._onProcessed = cb;
        }
    }

    constructor() {

    }

    isNote():boolean {
        return this.type === AppConstants.bookmark.type.note;
    }
    isAction():boolean {
        return this.type === AppConstants.bookmark.type.action;
    }
    isDecision():boolean {
        return this.type === AppConstants.bookmark.type.decision;
    }

    isProcessed():boolean {
        return !!this._base64AudioData;
    }
}

export class BookmarkFactory {
    create():Bookmark {
        return new Bookmark();
    }
}
