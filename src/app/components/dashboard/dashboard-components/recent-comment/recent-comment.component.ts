import { Component, Input } from '@angular/core';
@Component({
  selector: 'recent-comment',
  templateUrl: './recent-comment.component.html'
})
export class RecentcommentComponent {
  @Input()
  records;
  constructor() {
  }
}
