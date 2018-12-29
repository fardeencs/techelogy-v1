import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img[src]',
    host: {
      '(error)':'SetDefaultUrl()',
      '[src]':'src'
     }
})
export class DefaultImageDirective {

  @Input() src:string;
    SetDefaultUrl() {
      this.src = './assets/images/broken-img/broken.gif';
    }

}
