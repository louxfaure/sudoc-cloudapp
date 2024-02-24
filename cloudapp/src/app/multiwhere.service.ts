import { Injectable } from '@angular/core';
import { Entity, CloudAppRestService } from "@exlibris/exl-cloudapp-angular-lib";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class MultiwhereService {

  constructor(
    private http: HttpClient,
    private restService: CloudAppRestService,
    private translate: TranslateService
  ) { }

  search(entities: Entity[]) {
    return this.restService.call(`/bibs?mms_id=${entities.map(e => e.id).join(',')}&view=brief`).pipe(
      map(resultats => this.extractPpnFromNetworkNumber(resultats.bib)),
      /* Break up Hathitrust query into chunks */
      // map(resultats=>this.SudocQueries(resultats))
      switchMap(resultats => this.http.get<any>(`https://www.sudoc.fr/services/multiwhere/${resultats.map(resultat => resultat.ppn).join(',')}&format=text/json`)
        .pipe(
          map(q => {
            let m = Object.assign({}, ...Object.keys(q['sudoc']['query']).map(k => ({ [q['sudoc']['query'][k]['ppn']]: q['sudoc']['query'][k] })));
            let n = Object.assign({}, ...Object.keys(resultats).map(k => ({ [resultats[k]['ppn']]: resultats[k] })));
            let v = Object.assign({}, ...Object.keys(m).map(k => ({ [n[k]['mms_id']]: Object.assign({}, m[k], n[k]) })));
            // let v = Object.assign({},m,n);
            // console.log(v)
            return this.buildSearchresultats(v);
          }),
          // )),
          /* Combine resultats and flaten records array */
          // map(resultats=>resultats = omap(combine(resultats[0]['sudoc']['result']), r=>({record: r.ppn, availability: this.calculateAvailability(r.library)}))
        )))
  }

  private buildSearchresultats(bibs: {}) {
    let r: {} = {};
    for (let mmsid in bibs) {
      let loc: number;
      // work on localisation
      if ('result' in bibs[mmsid]) {
        if (Array.isArray(bibs[mmsid]['result']['library'])) {
          loc = bibs[mmsid]['result']['library'].length;
        }
        else {
          loc = 1;
        }
      }
      r[mmsid] = {
        'locations': loc,
        'ppn': bibs[mmsid]['ppn'],
        'url': 'http://www.sudoc.fr/' + bibs[mmsid]['ppn']
      };
    }
    return r;
  }

  private extractPpnFromNetworkNumber(bibs: any[]) {
    return bibs.map(bib => {
      let ppn = null;
      if (bib.network_number) {
        // Nécessaire pour mettre le ppn valide en première position
        bib.network_number.reverse();
        for (let i = 0; i < bib.network_number.length; i++) {
          let m = bib.network_number[i].match(/^\(PPN\)(.{9})/);
          if (m) {
            ppn = m[1];
            bib.ppn = ppn;
            break;
          }
        }
      }
      // console.log("PPN : " + ppn)
      return bib;
    });
  }

}

