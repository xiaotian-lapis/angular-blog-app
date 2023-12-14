import {RouterModule, Routes} from '@angular/router';
import {DiscoverComponent} from './discover.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DiscoverComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoverRoutingModule {
}
