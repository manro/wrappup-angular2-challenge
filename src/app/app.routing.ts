import { RecordingComponent } from './views/recording/recording.component';
import { Routes, RouterModule } from '@angular/router';
import { UrlConstants } from './constants/url.constants';


const routes: Routes = [
    { path: '',  redirectTo: UrlConstants.index.recording.url, pathMatch: 'full' },
    { path: UrlConstants.index.recording.url, component: RecordingComponent }
];

export const routing = RouterModule.forRoot(routes);
