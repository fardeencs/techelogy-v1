import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'control-messages',
  template: `<div class ="text-danger" *ngIf="errorMessage !== null">{{errorMessage}}</div>`,
  providers: [TranslatePipe]
})
export class ControlMessages {
  @Input() control: FormControl;

  @Input() messages: Array<any>;
  
  constructor(private translatePipe : TranslatePipe) {}

  get errorMessage() {   

    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.translatePipe.transform(this.messages[propertyName]) || this.messages[propertyName];
      }
    }
    return null;
  }
}
