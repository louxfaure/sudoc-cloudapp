import { Injectable } from '@angular/core';
import { Entity, CloudAppRestService } from "@exlibris/exl-cloudapp-angular-lib";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { forkJoin, of} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class AlmaService {

  constructor(
    private http: HttpClient,
    private restService: CloudAppRestService,
    private translate: TranslateService
  ) { }

  search(entities: Entity[]) {
    return this.restService.call(`/bibs?mms_id=${entities.map(e => e.id).join(',')}&view=brief`).pipe(
      map(resultats => 
        this.extractPpnFromNetworkNumber(resultats.bib)
      ),
      switchMap(resultats => {
        const liste_ppns = resultats.map(result => result.ppn).filter(ppn => ppn !== null && ppn !== undefined);
        // console.log(ppns)
        return of(liste_ppns);
      })
      
      /* Break up Hathitrust query into chunks */
      // map(resultats=>this.SudocQueries(resultats))
      )
  }

  // private buildSearchresultats(ppns: {}) {
  //   let : {} = {};
  //   for (let mmsid in bibs) {
  //     let loc: number;
  //     // work on localisation
  //     if ('result' in bibs[mmsid]) {
  //       if (Array.isArray(bibs[mmsid]['result']['library'])) {
  //         loc = bibs[mmsid]['result']['library'].length;
  //       }
  //       else {
  //         loc = 1;
  //       }
  //     }
  //     r[mmsid] = {
  //       'locations': loc,
  //       'ppn': bibs[mmsid]['ppn'],
  //       'url': 'http://www.sudoc.fr/' + bibs[mmsid]['ppn']
  //     };
  //   }
  //   return r;
  // }

  private extractPpnFromNetworkNumber(bibs: any[]) {
    return bibs.map(bib => {
      console.log(bib);
      let ppn = null;
      if (bib.network_number) {
        // Nécessaire pour mettre le ppn valide en première position
        bib.network_number.reverse();
        for (let i = 0; i < bib.network_number.length; i++) {
          let m = bib.network_number[i].match(/^\(PPN\)([0-9xX]{9})/);
          if (m) {
            ppn = m[1];
            bib.ppn = ppn;
            break;
          }
        }
      }
      return bib;
    });
  }

}

