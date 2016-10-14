import { Component, Input, OnInit } from '@angular/core';
import { Bookmark } from '../../models/bookmark.factory';
import { AppConstants } from '../../constants/app.constants';

@Component({
    selector: 'wu-view-bookmark',
    templateUrl: 'view-bookmark.component.html',
    styleUrls: ['view-bookmark.component.less']
})
export class ViewBookmarkComponent implements OnInit {

    @Input() bookmark;

    constructor() { }

    ngOnInit() { }

}
