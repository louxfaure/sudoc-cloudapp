import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { HelpComponent } from './help/help.component';
import { ErrorComponent } from './static/error.component';
import { ConfigurationComponent, ConfigurationGuard } from './configuration/configuration.component';
import { NblocsudocComponent } from './nblocsudoc/nblocsudoc.component';
import { SynchrosudocComponent } from './synchrosudoc/synchrosudoc.component';
import { PpnListComponent } from './ppn-list/ppn-list.component';


const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'help', component: HelpComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'config', component: ConfigurationComponent, canActivate: [ConfigurationGuard] },
  { path: 'nblocsudoc', component: NblocsudocComponent },
  { path: 'synchrosudoc', component: SynchrosudocComponent },
  {path: 'ppn-list', component: PpnListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
