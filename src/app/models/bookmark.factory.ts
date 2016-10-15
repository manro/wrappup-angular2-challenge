import { AppConstants } from '../constants/app.constants';
import { Utils } from '../services/utils/utils';

export class Bookmark {
    id: string = null;
    text:string;
    type:string = AppConstants.bookmark.type.note;

    start: number; //bytes count
    end: number; //bytes count

    get startTime() {
        return (
            Utils.formatTimeDuration(
                this.start * 1000
            )
        )
    }

    get endTime() {
        return (
            Utils.formatTimeDuration(
                this.end * 1000
            )
        )
    }

    constructor() {
        this.id = Utils.getGUID();
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
