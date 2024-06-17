import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { MaterialModule, CloudAppTranslateModule, AlertModule, MenuModule } from '@exlibris/exl-cloudapp-angular-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { NblocsudocComponent } from './nblocsudoc/nblocsudoc.component';
import { ErrorComponent } from './static/error.component';

import { MultiwhereService } from './multiwhere.service';
import { AlmaService } from './alma.service';
import { SudocSearchService } from './sudoc.service';
import { SynchrosudocComponent } from './synchrosudoc/synchrosudoc.component';
import { HelpComponent } from './help/help.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { PpnListComponent } from './ppn-list/ppn-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NblocsudocComponent,
    SynchrosudocComponent,
    HelpComponent,
    ConfigurationComponent,
    ErrorComponent,
    PpnListComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AlertModule,
    MenuModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule,     
    CloudAppTranslateModule.forRoot(),
  ],
  providers: [
    SudocSearchService,
    MultiwhereService,
    AlmaService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
