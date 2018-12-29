import { Component, Input } from '@angular/core';
@Component({
  selector: 'income-counter',
  templateUrl: './income-counter.component.html',
})
export class IncomeCounterComponent {
  @Input()
  counters;
  constructor() {
  }
}
