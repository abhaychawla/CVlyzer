/** Angular Imports */
import { NgModule } from '@angular/core';

/** Angular Font Awesome Imports */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faDownload,
  faEye,
  faEyeSlash,
  faFileUpload,
  faLock,
  faSearch,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

/** Add icons to the library for convenient access in other components. */
library.add(
  faDownload,
  faEye,
  faEyeSlash,
  faFileUpload,
  faGithub,
  faLinkedin,
  faLock,
  faSearch,
  faTwitter,
  faUserCircle
);

/**
 * Icons Module
 *
 * Angular Font Awesome module is exported here.
 */
@NgModule({
  exports: [FontAwesomeModule]
})
export class IconsModule { }
