import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {filter,map,mergeMap} from 'rxjs/operators';


import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {

	@Input() layout;
    pageInfo;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private translate: TranslateService
    ) {
        this
        .router.events
        .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this.activatedRoute)
        ,map(route => {
            while (route.firstChild) route = route.firstChild;
            return route;
        })
        ,filter(route => route.outlet === 'primary')
        ,mergeMap(route => route.data))
        .subscribe((event) => {
           this.translate.get(event['title']).subscribe((title)=>{
             this.titleService.setTitle(title);
           });
           this.pageInfo = event;
        });
    }
    ngOnInit() { }
}
