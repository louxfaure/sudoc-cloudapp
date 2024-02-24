import { Injectable } from '@angular/core';
import { Entity, CloudAppRestService } from "@exlibris/exl-cloudapp-angular-lib";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class SudocSearchService {

  constructor(
    private http: HttpClient,
    private restService: CloudAppRestService,
    private translate: TranslateService
  ) { }

  search(entities: Entity[], iln: number) {
    console.log("iln : " + iln);
    return this.restService.call(`/bibs?mms_id=${entities.map(e => e.id).join(',')}&view=brief`).pipe(
      map(results => this.extractPpnFromNetworkNumber(results.bib)),
      /* Break up Hathitrust query into chunks */
      // map(results=>this.SudocQueries(results))
      switchMap(results => this.http.get<any>(`https://www.sudoc.fr/services/where/${iln}/${results.map(result => result.ppn).join(',')}&format=text/json`)
        .pipe(
          map(q => {
            let m = Object.assign({}, ...Object.keys(q['sudoc']['result']).map(k => ({ [q['sudoc']['result'][k]['ppn']]: q['sudoc']['result'][k] })));
            let n = Object.assign({}, ...Object.keys(results).map(k => ({ [results[k]['ppn']]: results[k] })));
            let v = Object.assign({}, ...Object.keys(m).map(k => ({ [n[k]['mms_id']]: Object.assign({}, m[k], n[k]) })));
            // let v = Object.assign({},m,n);
            // console.log(v)
            return this.buildSearchResults(v);
            // console.log(results[2]);
          }),
          // )),
          /* Combine results and flaten records array */
          // map(results=>results = omap(combine(results[0]['sudoc']['result']), r=>({record: r.ppn, availability: this.calculateAvailability(r.library)}))
        )))
  }

  private buildSearchResults(bibs: {}) {
    let r: {} = {};
    for (let mmsid in bibs) {
      let loc: string[] = [];
      let isUpToDate: boolean = false;

      // work on localisation
      if ('library' in bibs[mmsid]) {
        if (Array.isArray(bibs[mmsid]['library'])) {
          loc = bibs[mmsid]['library'];
        }
        else {
          loc.push(bibs[mmsid]['library']);
        }
      }
      //test if record is up to date bib0touched is Sudoc update date last_modified_date is Alma update date
      let updateDateSudoc: Date = new Date(bibs[mmsid]['bib0touched'].substr(0, 10));
      let updateDateAlma: Date = new Date(bibs[mmsid]['last_modified_date'].substr(0, 10));
      if (updateDateAlma >= updateDateSudoc) {
        isUpToDate = true;
      }
      r[mmsid] = {
        'isUpToDate': isUpToDate,
        'locations': loc,
        'ppn': bibs[mmsid]['ppn'],
        'url': 'http://www.sudoc.fr/' + bibs[mmsid]['ppn']
      };
    }
    console.log(r);
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

