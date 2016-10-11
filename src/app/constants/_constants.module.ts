import { NgModule } from '@angular/core';
import { AppConstants, UrlConstants } from '../constants';


@NgModule({
    providers: [
        { provide: AppConstants, useValue: true },
        { provide: UrlConstants, useValue: true }
    ]
})
export class AppConstantsModule { }
