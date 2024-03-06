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
      if (!this.iln) {
        this.alert.error("Vous devez renseigner au prélable un ILN via l'écran de configuration. Pour y accéder, il est nécessaire de disposer des droits suivants : Administrateur de répertoire, Administrateur des acquisitions, Administrateur du catalogue ou Administrateur général du système. Si vous ne disposez pas de ce niveau d'autorisation, adressez vous à votre administrateur Alma.");
        this.iln = 15;
      }
      this.pageLoad$ = this.eventsService.onPageLoad( pageInfo => {
        const entities = (pageInfo.entities||[]).filter(e=>e.type==EntityType.BIB_MMS);
        console.log("Entities:", entities);
        if (entities.length > 0) {
          this.loading = true;
          this.bibs = entities;
          console.log("Initial Bibs:", this.bibs);
          this.sudoc.search(entities,this.iln).pipe(
            finalize(() => {
              this.loading = false;
              console.log("Final Bibs:", this.bibs);
            })
          )
          .subscribe({ 
            next: results => {
              console.log("Results:", results);
              Object.keys(results).forEach(key=> {
                const bib = this.bibs.find(b=>b.id==key);
                if(bib){
                  bib.sudoc=results[key]
                }
              });
           },
            error: e => this.alert.error(`An error occurred while loading availability:<br>${e.message}`),
          });
        }
      });
    });  
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }
}