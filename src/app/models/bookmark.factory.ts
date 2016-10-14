export class Bookmark {
    text:string;
    type:string;

    start: number;
    end: number;


    constructor() {

    }
}

export class BookmarkFactory {
    create():Bookmark {
        return new Bookmark();
    }
}
