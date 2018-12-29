import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.css']
})
export class DocumentTypeComponent extends BaseComponent implements OnInit {

  constructor(
    protected _router: Router, _location: Location) {
    super(_router, _location);

  }

  ngOnInit() {}
}
