import { Component, OnInit, Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService, AlertService, InitData, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
// import { ToastrService } from 'ngx-toastr';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Configuration } from '../models/configuration';
import { ErrorMessages } from '../static/error.component';

const configAdminRoles = [
  "General System Administrator",
  "Acquisitions Administrator",
  "Catalog Administrator",
  "Repository Administrator",
  "Administrateur de répertoire",
  "Administrateur des acquisitions",
  "Administrateur du catalogue",
  "Administrateur général du système"
];

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  configForm: FormGroup;
  saving: boolean = false;
  has_
  
  constructor(
    private appService: AppService,
    private configService: CloudAppConfigService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.configService.getAsFormGroup().subscribe( configuration => {
      this.configForm = Object.keys(configuration.value).length==0 ?
        FormGroupUtil.toFormGroup(new Configuration()) :
        configuration;
    });
  }

  saveConfig() {
    this.saving = true;
    this.configService.set(this.configForm.value).subscribe(
      () => {
        this.alert.success('Configuration saved.');
        this.configForm.markAsPristine();
      },
      err => this.alert.error(err.message),
      ()  => this.saving = false
    );
  }  

}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor (
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      /* Until primaryId is available: */
      switchMap(data => iif(() => 
        data.user.primaryId==null,
        this.restService.call(`/users?q=${query(data)}`).pipe(
          map( resp => resp.user[0].primary_id )
        ),
        of(data.user.primaryId)
      )),
      switchMap( primaryId => this.restService.call(`/users/${primaryId}`)),
      map( user => {
        console.log(user)
        if (!user.user_role.some(role => configAdminRoles.includes(role.role_type.desc))) {
          console.log("pas le droit")
          this.router.navigate(['/error'], 
            { queryParams: { error: ErrorMessages.NO_ACCESS }});
          return false;
        }
        return true;
      })
    );
  }
}

const query = (data: InitData) => `first_name~${q(data.user.firstName)}+AND+last_name~${q(data.user.lastName)}`;
const q = val => encodeURIComponent(val.replace(' ', '+'));
