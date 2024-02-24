import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppConfigService, AlertService, CloudAppEventsService, EntityType } from '@exlibris/exl-cloudapp-angular-lib';
import { SudocSearchService } from '../sudoc.service';
import { Configuration } from '../models/configuration';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-synchrosudoc',
  templateUrl: './synchrosudoc.component.html',
  styleUrls: ['./synchrosudoc.component.scss']
})
export class SynchrosudocComponent implements OnInit, OnDestroy {

  private pageLoad$: Subscription;
  configuration: Configuration;
  bibs: any[] = [];
  loading = false;
  iln: number;
  

  constructor(
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private sudoc: SudocSearchService,
    private configService: CloudAppConfigService,
  ) {  
  }

  ngOnInit() {
    this.configService.get().subscribe( (config) => {
      this.iln = config.iln;
      this.pageLoad$ = this.eventsService.onPageLoad( pageInfo => {
        const entities = (pageInfo.entities||[]).filter(e=>e.type==EntityType.BIB_MMS);
        if (entities.length > 0) {
          this.loading = true;
          this.bibs = entities;
          this.sudoc.search(entities,this.iln).pipe(
            finalize(() => this.loading = false)
          )
          .subscribe({ 
            next: results => Object.keys(results).forEach(key=>this.bibs.find(b=>b.id==key).sudoc=results[key]),
            // next: results => {console.log(this.bibs); console.log("results"); console.log(results)},
            error: e => this.alert.error(`An error occurred while loading availability:<br>${e.message}`),
          });
          console.log(this.bibs)
        }
      });
    });  
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }
}