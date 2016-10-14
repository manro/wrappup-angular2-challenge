import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppConstants } from '../../constants/app.constants';

@Component({
    selector: 'wu-add-bookmark',
    templateUrl: 'add-bookmark.component.html',
    styleUrls: ['add-bookmark.component.less'],
})
export class AddBookmarkComponent implements OnInit {

    @Input() bookmark;
    @Output() bookmarkNotify = new EventEmitter();

    AppConstants = AppConstants;

    constructor() { }

    ngOnInit() { }

    @ViewChild('textarea') textarea;

    ngAfterViewInit() {
        this.textarea.nativeElement.focus();
    }

    /*text: string = null;*/

    save() {
        this.bookmarkNotify.emit({
            action: 'save',
            payload: this.bookmark
        });
    }

    cancel() {
        this.bookmarkNotify.emit({
            action: 'cancel'
        });
    }

}
