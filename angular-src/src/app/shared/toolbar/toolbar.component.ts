import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ProgressBarService } from 'src/app/core/progress-bar/progress-bar.service';

@Component({
  selector: 'cvlyzer-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  /** Progress bar mode. */
  progressBarMode: string;
  /** Subscription to progress bar. */
  progressBar$: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private progressBarService: ProgressBarService,
              private router: Router) { }

  ngOnInit() {
    this.progressBar$ = this.progressBarService.updateProgressBar.subscribe((mode: string) => {
      this.progressBarMode = mode;
    });
  }

  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  /**
   * Unsubscribes from progress bar.
   */
  ngOnDestroy() {
    this.progressBar$.unsubscribe();
  }

}
