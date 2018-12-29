import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './manage-certificate.component.html',
  styleUrls: ['./manage-certificate.component.css']
})
export class ManageCertificateComponent extends BaseComponent implements OnInit {

  constructor(
    protected _router: Router, _location: Location) {
    super(_router, _location);
  }

  ngOnInit() {}
}
