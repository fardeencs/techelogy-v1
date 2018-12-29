import { Component, EventEmitter, Input, Output, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { TreeviewI18n } from './treeview-i18n';
import { TreeviewItem, TreeviewSelection } from './treeview-item';
import { TreeviewConfig } from './treeview-config';
import { TreeviewComponent } from './treeview.component';
import { DropdownDirective } from './dropdown.directive';
import { TreeviewHeaderTemplateContext } from './treeview-header-template-context';
import { TreeviewItemTemplateContext } from './treeview-item-template-context';
import { log } from 'util';

@Component({
    selector: 'treeview-dropdown',
    templateUrl: './dropdown-treeview.component.html',
    styleUrls: ['./dropdown-treeview.component.scss']
})
export class DropdownTreeviewComponent {
    @Input() buttonClass = 'btn-outline-secondary';
    @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
    @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
    @Input() items: TreeviewItem[];
    @Input() config: TreeviewConfig;
    @Output() selectedChange = new EventEmitter<any[]>(true);
    @Output() filterChange = new EventEmitter<string>();
    @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
    @ViewChild(DropdownDirective) dropdownDirective: DropdownDirective;
    public selectedItems :any;

    constructor(
        public i18n: TreeviewI18n,
        private defaultConfig: TreeviewConfig
    ) {
        this.config = this.defaultConfig;
        
    }

    ngOnInit(){
        //this.getText();
    }

    ngOnChanges(){
        //this.getText();
    }
    
    getText() {
            this.selectedItems =  (this.treeviewComponent.selection && this.treeviewComponent.selection.checkedItems) 
                                ? this.treeviewComponent.selection.checkedItems 
                                : this.treeviewComponent.selection;
                                            
        
        //return this.i18n.getText(this.treeviewComponent.selection);
    }


    // getText(): string {
    //     return this.i18n.getText(this.treeviewComponent.selection);
    // }

    onSelectedChange(values: any[]) {
        this.selectedChange.emit(values);
    }

    removeSelectedValue(index, item){
        if(this.treeviewComponent.selection && this.treeviewComponent.selection.checkedItems){
            this.treeviewComponent.selection.checkedItems = this.treeviewComponent.selection.checkedItems.map((d)=> {
               if(d.value == item.value){
                   d.checked = false;
               }
               return d;
           });
             
            this.treeviewComponent.selection.checkedItems.splice(index,1);
        }
    }

    onFilterChange(text: string) {
      this.filterChange.emit(text);
    }
}
