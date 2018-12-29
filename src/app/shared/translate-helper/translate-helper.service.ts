import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../global.state';
import { LANGUAGE, STATE_EVENT } from '../../modules';

@Injectable()
export class TranslateHelperService {
  constructor(private translate: TranslateService, private _globalState: GlobalState) {
    debugger
    /**
     * All the translation settings including the event will be registered
     * as soon as the module is lazy loaded, since this translate helper is registered
     * in shared module and no specfic intialization won't be required
     */

    // internationalization specific setting
    this.translate.addLangs(LANGUAGE.AVAILABLE_LANGUAGE);
    this.translate.setDefaultLang(LANGUAGE.DEFAULT_LANGUAGE);
    this.switchLanguage(LANGUAGE.DEFAULT_LANGUAGE);

    /**
     * Language Change Listener, we need to register this event to 
     * change the language for this specific instance of translation,
     * since all module translations are isolarted to each other
     */
    this._globalState.subscribe(STATE_EVENT.LANGUAGE_CHANGED,
      (lang) => {
        this.switchLanguage(lang);
      });
  }

  /**
   * function for switching language
   * @param language
   */
  switchLanguage(language: string) {
    this.translate.use(language);
  }


}
