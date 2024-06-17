import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { CloudAppConfigService, AlertService, CloudAppEventsService, EntityType } from '@exlibris/exl-cloudapp-angular-lib';
import { AlmaService } from '../alma.service';
import { finalize } from 'rxjs/operators';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-ppn-list',
  templateUrl: './ppn-list.component.html',
  styleUrls: ['./ppn-list.component.scss']
})
export class PpnListComponent implements OnInit, OnDestroy  {
  private pageLoad$: Subscription;
  records: any[] = [];
  loading: boolean = false;
  ppns_qualimarc: string = '';
  requete_ppns_sudoc: string = '';
  ppns_pour_fichier : string ='';
  nb_ppns: number = 0;

  constructor(
    private eventsService: CloudAppEventsService,
    private multiwhere: AlmaService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.pageLoad$ = this.eventsService.onPageLoad(pageInfo => {
      console.log("PageInfo :", pageInfo);
      const entities = (pageInfo.entities || []).filter(e => e.type == EntityType.BIB_MMS);
      console.log("Entities:", entities)
      if (entities.length > 0) {
        this.loading = true;
        this.records = entities;
        this.multiwhere.search(entities).pipe(
          finalize(() => this.loading = false)
        )
          .subscribe({
            next: ppns => {
              console.log("PPNs:", ppns);
              this.nb_ppns = ppns.length; 
              this.ppns_qualimarc = ppns.map(ppns => ppns).join(',');
              this.ppns_pour_fichier = ppns.map(ppns => ppns).join("\r\n");
              // let ppns_sudoc = ppns.map(ppns => ppns).join(' OU ');
              this.requete_ppns_sudoc = 'CHE PPN ' + ppns.map(ppns => ppns).join(' OU ');
            },
          });
        
      }
      else {
        this.ppns_qualimarc = '';
        this.requete_ppns_sudoc = '';
        this.nb_ppns = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  public onClipboardCopy(successful: boolean): void {
    console.log(successful);
    if (successful) {
      this.alert.success('Les PPN ont été copiés avec succés');
    } else {
      this.alert.error("Attention les PPNS n'ont pas été copiés. Veuillez recommencer.");
    }
  }

}
