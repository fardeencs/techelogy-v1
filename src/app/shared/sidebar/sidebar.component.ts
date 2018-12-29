import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouteInfo } from './sidebar.metadata';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../components/base.component';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { routes } from '../../app-routing.module';
import { STATE_EVENT, LOCAL_STORAGE } from '../../modules/constants';
import { GlobalState } from '../../global.state';
import { LocalStorageService } from '../../services/local-storage.service';
import {TranslateService} from "@ngx-translate/core";
import {filter,map,mergeMap} from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html'

})
export class SidebarComponent extends BaseComponent implements OnInit , AfterViewInit {
  showMenu = '';
  showSubMenu = '';
  ROUTES: Array<Object>;
  public sidebarnavItems: any[];
  isPageLoaded:boolean = false;
  selectedModule;
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';

    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';

    } else {
      this.showSubMenu = element;
    }
  }

  constructor(private modalService: NgbModal,
    private router: Router,
    private _globalState: GlobalState,
    private _localStorageService: LocalStorageService,
    private translate:TranslateService,
    private route: ActivatedRoute,
    private _authenticateService: AuthService,
    protected _location: Location) {
    super(router, _location);
    this.getMenuItems();

    //show selected menu on load
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
      ,map(() => this.route)
      ,map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      ,filter(route => route.outlet === 'primary')
      ,mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title)=>{
          if(!this.isPageLoaded){
            this.showSubMenu = title;
            this.selectedModule = event;
            this.isPageLoaded = true;
          }
        });
      });


  }
  // End open close
  ngOnInit() {}

  ngAfterViewInit(){
    //show selected menu on load
    if(this.selectedModule) {
      setTimeout(()=> {
        $('#' + this.selectedModule['moduleID']).trigger('click');
        this.showMenu = $.trim($('#' + this.selectedModule['moduleID']).find('span').text());
      }, 1000);
    }
  }

  initMenuScript() {
    const self = this;
    this.sidebarnavItems = this.ROUTES.filter(sidebarnavItem => sidebarnavItem);
    $(function () {
      $('.sidebartoggler').on('click', function () {
        if ($('#main-wrapper').hasClass('mini-sidebar')) {
          $('body').trigger('resize');
          $('#main-wrapper').removeClass('mini-sidebar');
          self._localStorageService.set(LOCAL_STORAGE.MENU_COLLAPSED, 'N');
          self._globalState.notifyDataChanged(STATE_EVENT.RESIZE_DATATABLE, 'SIDEMENU_TOGGLED_FALSE');
        } else {
          $('body').trigger('resize');
          $('#main-wrapper').addClass('mini-sidebar');
          self._localStorageService.set(LOCAL_STORAGE.MENU_COLLAPSED, 'Y');
          self._globalState.notifyDataChanged(STATE_EVENT.RESIZE_DATATABLE, 'SIDEMENU_TOGGLED_TRUE');
        }

      });

      // if menu value is collapsed add below class
      const isMenuCollapsed = self._localStorageService.get(LOCAL_STORAGE.MENU_COLLAPSED);
      if (isMenuCollapsed === 'Y') {
        $('#main-wrapper').addClass('mini-sidebar');
      }
    });
  }

  public getMenuItems(): void {
    try {
      this._authenticateService
        .getPermissions()
        .subscribe((response) => {
          this.ROUTES = response.data;
          console.log('permissions',  response.data);

          // this.initMenu(this.ROUTES);
          this.initMenuScript();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
  initMenu(menu){
    let url=this.router.url;
    if (typeof menu !='undefined' && menu.length) {
      menu.forEach(ele => {
        if (typeof ele.submenu !='undefined' && ele.submenu.length) {
            this.initMenu(ele.submenu);
        } else {
          if (url.indexOf(ele.routes) != -1) {
            this.showMenu = this.showSubMenu = ele.moduleName;
          }
        }
      })
    }
    return true;
  }
}
