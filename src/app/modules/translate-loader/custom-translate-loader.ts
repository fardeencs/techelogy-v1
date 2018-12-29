import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { COMMON_TRANSLATE_FILE } from "../constants";

export class CustomTranslateLoader implements TranslateLoader {

    constructor(private http: HttpClient, private prefix?: string, private suffix?: string) {}

    getTranslation(lang: string) {
        let languageObservables = forkJoin(
            this.http.get(COMMON_TRANSLATE_FILE + lang + this.suffix),
            this.http.get(this.prefix + lang + this.suffix)
        );
        return languageObservables.pipe(map((res) => Object.assign(res[0],res[1])));
    }
}