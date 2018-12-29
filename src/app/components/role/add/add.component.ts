import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { RoleFormModel } from '../../../models/form/role.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {
  public roleToken: string;
  public role: RoleFormModel;
  public PERMISSIONS: Array<Object>;
  public roles: Array<Object>;
  public masterPermissions: Array<any>;
  public permissions: Array<string> = [];
  public editPermissions:Array<any>=[];
  public pageInfo;

  @ViewChild('roleForm') roleForm: ElementRef;

  constructor(protected _router: Router,
    public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    protected _location: Location,
    private _roleService: RoleService,
    private titleService: Title,
    private translate: TranslateService) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this._activatedRoute)
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


    this.role = new RoleFormModel();
    this.roleToken = this._activatedRoute.snapshot.params.id;
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.role.permission = [];
    this.PERMISSIONS = [
      {
        id: 1,
        label: 'All'
      }, {
        id: 2,
        label: 'Custom'
      }
    ];
    if (this.roleToken) {
      // EDIT ROLE
      this.getDetail();
    } else {
      // ADD ROLE
      this.getPermissions();
    }
  }

  ngOnInit() {
    this.role.permissionType = 2;
  }

  ngAfterViewInit() { }

  getPermissions() {
    try {
      this
        ._roleService
        .permissionList()
        .subscribe((response) => {
          this.masterPermissions = response.data;
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getDetail() {
    this._roleService.view(this.roleToken).subscribe((response) => {
      this.role.roleName = response.roleName;
      this.masterPermissions = response.permission;
      this.role.permissionType = response.permissionType;
      this.role.defaultRole = response.defaultRole;
      this.getPrePermission(this.masterPermissions);
      this.prepareModuleArrayOnEdit();
    },(error) => {
        this.setError(error.message);
      });
  }

  action() {
    this.prepareModuleArrayOnEdit();
    if (this.roleToken !== undefined) {
      this.updateRole();
    } else {
      this.addRole();
    }
  }

  addRole() {
    try {
      if (this.role.validate('roleForm')) {
        try {
          this
            ._roleService
            .add(this.role)
            .subscribe((response) => {
              this.roleForm.nativeElement.reset();
              this.role.permissionType = 2;
              this.setSuccess(response.message);
              this.navigateByUrl('role/view');
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateRole() {
    try {
      if (this.role.validate('roleForm')) {
        try {
          this
            ._roleService
            .update(this.roleToken, this.role)
            .subscribe((response) => {
              this.setSuccess('ROLE_UPDATED_SUCCESSFULLY');
              this.back();
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  changeStatus(roles, firstParent, secondParent, thirdParent, level) {
    roles.isChecked = !roles.isChecked;
    // LEVEL 1 (Select All Child Nodes)
    if (roles.submenu) {
      this.mapChilsnodes(roles.submenu, roles.isChecked);
      roles
        .submenu
        .forEach(role => {
          if (role.submenu) {
            this.mapChilsnodes(role.submenu, roles.isChecked);
            role
              .submenu
              .forEach(role1 => {
                if (role1.submenu) {
                  this.mapChilsnodes(role1.submenu, roles.isChecked);
                }
              });
          }
        });
    }
    if (roles.isChecked) {
      switch (level) {
        case 2:
          // Level 2 (Select First Parent)
          firstParent.isChecked = roles.isChecked;
          break;
        case 3:
          // LEVEL 3 (Select First Parent and Second Parent)
          firstParent.isChecked = roles.isChecked;
          secondParent.isChecked = roles.isChecked;
          break;
      }
    }
  }

  prepareModuleArrayOnEdit() {
    this.masterPermissions.forEach(role => {
      if (role.submenu) {
        this.mapChilsnodesOnEdit(role.submenu);
        role
          .submenu
          .forEach(role1 => {
            if (role1.submenu) {
              this.mapChilsnodesOnEdit(role1.submenu);
              role1
              .submenu
              .forEach(role2 => {
                if (role2.submenu) {
                  this.mapChilsnodesOnEdit(role2.submenu);
                }
              });
            }
          });
      }
      this.role.permission.push(role);
    });
  }

  mapChilsnodesOnEdit(submenus) {
    submenus.map((res) => {
      this.role.permission.push(res);
    });
  }

  mapChilsnodes(submenus, isChecked) {
    submenus.map((res) => {
      res.isChecked = isChecked;
      // this.role.permission.push(res);
    });
  }

  changeAll() {
    if (this.role.permissionType == 1) {
      // All Roles Iteration
      this
        .masterPermissions
        .forEach(role => {
          // Enable current node
          role.isChecked = true;
          // Enable current node childrens
          this.mapChilsnodes(role.submenu, true);
          this.role.permission.push(role);
          // Iterate for child nodes
          role.submenu.forEach(subrole => {
              // Enable child nodes
              this.mapChilsnodes(subrole.submenu, true);
              this.role.permission.push(subrole);
              subrole.submenu.forEach(subSubrole => {
                // Enable child nodes
                this.mapChilsnodes(subSubrole.submenu, true);
                this.role.permission.push(subSubrole);
              });
            });
        });
    }else if(this.roleToken && this.role.permissionType == 2){
        /** for edit mode */
      this.resetTocustomEdit();
    }else{
      this.role.permission = [];
      this.masterPermissions.forEach(role => {
        role.isChecked = false;
        this.mapChilsnodes(role.submenu, false);
        this.role.permission.push(role);
        role.submenu.forEach(subrole => {
            this.mapChilsnodes(subrole.submenu, false);
            this.role.permission.push(subrole);
            subrole.submenu.forEach(subSubrole => {
              this.mapChilsnodes(subSubrole.submenu, false);
              this.role.permission.push(subSubrole);
            });
          });
      });
    }
  }

  public cancelButtonAction() {
    try {
      const modal = this.modalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL',
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          // this._router.navigate(['/role/view']);
          this.back();
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Delete functionality
  */
  public onDelete() {
    this.showConfirmationDeleteModal(this.roleToken);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO',
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes
        this.delete(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete by id
   */
  delete(id): void {
    try {
      this._roleService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('ROLE_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
  /** store prefilled data */
  getPrePermission(data) {
    data.forEach((role: any) => {
      if (role.isChecked == true) {
        let r = role.moduleId;
        this.editPermissions.push(r);
      }
      if (typeof role.submenu != 'undefined' && role.submenu.length) {
        this.getPrePermission(role.submenu);
      }
    });
    return true;
  }
  resetTocustomEdit() {
    this.role.permission = [];
    this.masterPermissions.forEach((role: any) => {
      if (this.editPermissions.indexOf(role.moduleId) != -1) {
        role.isChecked = true;
      } else {
        role.isChecked = false;
      }
      if (typeof role.submenu != 'undefined' && role.submenu.length) {
        role.submenu.forEach(subrole => {
          if (this.editPermissions.indexOf(subrole.moduleId) != -1) {
            subrole.isChecked =  true;
          } else {
            subrole.isChecked =  false;
          }
          if (typeof subrole.submenu != 'undefined' && subrole.submenu.length) {
            subrole.submenu.forEach(l3 => {
              if (this.editPermissions.indexOf(l3.moduleId) != -1) {
                l3.isChecked =  true;
              } else {
                l3.isChecked =  false;
              }
              if (typeof l3.submenu != 'undefined' && l3.submenu.length) {
                l3.submenu.forEach(l4 => {
                  if (this.editPermissions.indexOf(l4.moduleId) != -1) {
                    l4.isChecked =  true;
                  } else {
                    l4.isChecked =  false;
                  }
                })
              }
            })
          }
        })
      }
    });
    return true;
  }
}
