import { AppConstants } from '../constants/app.constants';
import { Utils } from '../services/utils/utils';

export class Bookmark {
    id: string = null;
    text:string;
    type:string = AppConstants.bookmark.type.note;

    start: number; //seconds time
    end: number; //seconds time

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

    getPercentProgressFromTime(time:number) {
        return (
            (100 * ((time - this.start) / (this.end - this.start )))
        );
    }

}

export class BookmarkFactory {
    create():Bookmark {
        return new Bookmark();
    }
}
