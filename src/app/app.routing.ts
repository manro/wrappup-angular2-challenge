import { RecordingComponent } from './views/recording/recording.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: RecordingComponent }
];

export const routing = RouterModule.forRoot(routes);
