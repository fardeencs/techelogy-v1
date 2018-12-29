import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-validation-error',
  templateUrl: './form-validation-error.component.html'
})
export class FormValidationErrorComponent implements OnInit {

  @Input() isFormSubmitted;
	@Input() control;
  @Input() errMsg:Object;
  constructor() {}
  ngOnInit() { }
}
