import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[restrict]',
})
export class RestrictDirective {

  regexp:any;
  @Input() restrict:any;

  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const theEvent = event || window.event;
    const key = theEvent.keyCode || theEvent.which;

    // Don't validate the input if below arrow, delete and backspace keys were pressed
    if(key == 9 || key == 37 || key == 38 || key == 39 || key == 40 || key == 8 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
      return;
    }
   this.regexp = new RegExp(this.restrict, 'g');
   if ((event.key).search(this.regexp)) {
       event.preventDefault();
   }
 }
  @HostListener('paste', ['$event']) blockPaste(event) {
    const copiedTxt  = event.clipboardData.getData('text');
    this.regexp = new RegExp(this.restrict, 'g');
    if ((copiedTxt).search(this.regexp)) {
      event.preventDefault();
    }
  }

}
