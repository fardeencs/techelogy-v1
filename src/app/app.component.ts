import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { GlobalState } from './global.state';
import { STATE_EVENT, LANGUAGE } from './modules/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private translate: TranslateService, private _globalState: GlobalState) {

    // internationalization specific setting
    this.translate.addLangs(LANGUAGE.AVAILABLE_LANGUAGE);
    this.translate.setDefaultLang(LANGUAGE.DEFAULT_LANGUAGE);
    this.switchLanguage(LANGUAGE.DEFAULT_LANGUAGE);

    /**
     * Language Change Listener
     */
    this._globalState.subscribe(STATE_EVENT.LANGUAGE_CHANGED,
      (lang) => {
        this.switchLanguage(lang);
      });

    // if (ENV === 'production') {
    //     this.disableRightClick();
    // }
  }

  /**
   * function for switching language
   * @param language
   */
  switchLanguage(language: string) {
    this.translate.use(language);
  }

  public ngOnInit(): void {
    this.setupSessionStorage();
  }
  /**
    * Function for setSessionStorage
    */
  public setupSessionStorage() {
    if (!sessionStorage.length) {
      // Ask other tabs for session storage
      localStorage.setItem('getSessionStorage', Date.now().toString());
    }

    window.addEventListener('storage', function (event) {

      if (event.key === 'getSessionStorage') {
        // Some tab asked for the sessionStorage -> send it

        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorage');

      } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
        // sessionStorage is empty -> fill it

        // tslint:disable-next-line:prefer-const
        let data = JSON.parse(event.newValue), value;

        // tslint:disable-next-line:forin
        for (const key in data) {
          sessionStorage.setItem(key, data[key]);
        }
      }
    });

    // window.onbeforeunload = function() {
    //   sessionStorage.clear();
    // };
  }
  /**
   * Disable Right Click
   */
  public disableRightClick() {
      jQuery(document).bind('contextmenu', function (e) {
          e.preventDefault();
      });

      jQuery(document).keydown(function (event) {
          if (event.keyCode == 123) { // Prevent press F12
              return false;
          } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
              return false;
          }
      });
  }
}
