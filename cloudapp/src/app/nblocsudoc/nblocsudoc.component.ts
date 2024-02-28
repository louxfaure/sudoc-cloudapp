import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppConfigService, AlertService, CloudAppEventsService, EntityType } from '@exlibris/exl-cloudapp-angular-lib';
import { MultiwhereService } from '../multiwhere.service';
import { Configuration } from '../models/configuration';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-nblocsudoc',
  templateUrl: './nblocsudoc.component.html',
  styleUrls: ['./nblocsudoc.component.scss']
})

export class NblocsudocComponent implements OnInit, OnDestroy {
  private pageLoad$: Subscription;
  configuration: Configuration;
  records: any[] = [];
  loading = false;


  constructor(
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private multiwhere: MultiwhereService,
    private configService: CloudAppConfigService,
    // private config : Configuration
  ) {
  }

  ngOnInit() {
    this.pageLoad$ = this.eventsService.onPageLoad(pageInfo => {
      const entities = (pageInfo.entities || []).filter(e => e.type == EntityType.BIB_MMS);
      console.log("Entities:", pageInfo)
      if (entities.length > 0) {
        this.loading = true;
        this.records = entities;
        this.multiwhere.search(entities).pipe(
          finalize(() => this.loading = false)
        )
          .subscribe({
            next: test => Object.keys(test).forEach(key => this.records.find(b => b.id == key).multiwhere = test[key]),
            error: e => this.alert.error(`Impossible de contacter le service de l'ABES<br>${e.message}`),
          });
        console.log(this.records);
      }
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }
}