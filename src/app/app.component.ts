/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

/** rxjs Imports */
import { filter, map, mergeMap } from 'rxjs/operators';

/** Environment Configuration */
import { environment } from '../environments/environment';

/** Custom Services */
import { Logger } from './core/logger/logger.service';
import { AlertService } from './core/alert/alert.service';

/** Custom Models */
import { Alert } from './core/alert/alert.model';

/** Initialize Logger */
const log = new Logger('MifosX');

/**
 * Main component.
 */
@Component({
  selector: 'cvlyzer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * @param {Router} router Router for navigation.
   * @param {ActivatedRoute} activatedRoute Activated Route.
   * @param {Title} titleService Title Service.
   * @param {MatSnackBar} snackBar Material Snackbar for notifications.
   * @param {AlertService} alertService Alert Service.
   */
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              public snackBar: MatSnackBar,
              private alertService: AlertService) { }

  /**
   * Initial Setup:
   *
   * 1) Logger
   *
   * 2) Page Title
   *
   * 3) Alerts
   */
  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }
    log.debug('init');

    // Change page title on navigation or language change, based on route data
    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    onNavigationEnd.pipe(
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(`${title} | CVlyzer`);
        }
    });

    // Setup alerts
    this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      this.snackBar.open(`${alertEvent.message}`, 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }

}
