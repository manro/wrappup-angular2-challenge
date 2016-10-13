import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'wu-bookmark',
    templateUrl: 'bookmark.component.html',
    styleUrls: ['bookmark.component.less'],
})
export class BookmarkComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

    @ViewChild('textarea') textarea;

    ngAfterViewInit() {
        this.textarea.nativeElement.focus();
    }

}
