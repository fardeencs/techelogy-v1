import { Component, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements AfterViewInit {

  constructor(
    private titleService: Title
) {
  this.titleService.setTitle('Oops! - Not Found (#404)');
}

  ngAfterViewInit() {

    $(function () {
      $('.preloader').fadeOut();
    });
  }
}
