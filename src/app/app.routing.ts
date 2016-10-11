import { HomeComponent } from './views/recording/recording.component';
import { AboutComponent } from './views/about/about.component';
import { UsersComponent } from './views/users/users.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'users', component: UsersComponent}
];

export const routing = RouterModule.forRoot(routes);
