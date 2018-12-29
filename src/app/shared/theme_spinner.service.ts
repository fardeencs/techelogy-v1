import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';

export class ThemeSpinner {

  private _selector = 'preloader';
  private _element: HTMLElement;

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
    this._element = document.getElementById(this._selector);
    this
      .router
      .events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.show();
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.hide();
        }
      }, () => {
        this.hide();
      });
  }

  public show(): void {
    this._element.style['display'] = 'block';
  }

  public hide(delay: number = 0): void {
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }
}
