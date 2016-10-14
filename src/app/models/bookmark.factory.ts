import { AppConstants } from '../constants/app.constants';
import { Utils } from '../services/utils/utils';

export class Bookmark {
    text:string;
    type:string = AppConstants.bookmark.type.note;

    start: number;
    end: number;

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
}

export class BookmarkFactory {
    create():Bookmark {
        return new Bookmark();
    }
}
