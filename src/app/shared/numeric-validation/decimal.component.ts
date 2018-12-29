import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyDecimal]'
})
export class OnlyDecimalDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
      const charCode = (e.which) ? e.which : e.keyCode;
      if (charCode == 190) {
        const inputValue = e['value'];
        if (inputValue.indexOf('.') < 1) {
          return true;
        }
        return false;
      }
      if (charCode != 190 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
}
