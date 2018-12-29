import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './merchant-scheme.component.html',
  styleUrls: ['./merchant-scheme.component.css']
})
export class MerchantSchemeComponent extends BaseComponent implements OnInit {

  constructor(
    protected _router: Router,
    protected _location: Location) {
    super(_router, _location);

  }

  ngOnInit() {}
}
