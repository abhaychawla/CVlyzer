/** Angular Imports */
import { NgModule } from '@angular/core';

/** Angular Font Awesome Imports */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAt,
  faCheckCircle,
  faDownload,
  faEye,
  faEyeSlash,
  faFileUpload,
  faLock,
  faSearch,
  faSearchPlus,
  faTrashAlt,
  faUser,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

/** Add icons to the library for convenient access in other components. */
library.add(
  faAt,
  faCheckCircle,
  faDownload,
  faEye,
  faEyeSlash,
  faFileUpload,
  faGithub,
  faLinkedin,
  faLock,
  faSearch,
  faSearchPlus,
  faTrashAlt,
  faTwitter,
  faUser,
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
