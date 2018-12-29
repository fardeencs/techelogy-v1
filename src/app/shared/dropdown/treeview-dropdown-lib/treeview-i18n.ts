import { Injectable } from '@angular/core';
import { TreeviewItem, TreeviewSelection } from './treeview-item';
import * as _ from 'lodash';

@Injectable()
export abstract class TreeviewI18n {
    abstract getText(selection: TreeviewSelection): string;
    abstract getAllCheckboxText(): string;
    abstract getFilterPlaceholder(): string;
    abstract getFilterNoItemsFoundText(): string;
    abstract getTooltipCollapseExpandText(isCollapse: boolean): string;
}

@Injectable()
export class TreeviewI18nDefault extends TreeviewI18n {
    getText(selection: TreeviewSelection): any {
 
        if (selection.uncheckedItems.length === 0) {
            return this.getAllCheckboxText();
        }

        switch (selection.checkedItems.length) {
            case 0:
                return 'Select options';
            // case 1:
            //     return selection.checkedItems[0].text;
            default:
               
                let selectedItems = [];
                return  selection.checkedItems 
                                ? selection.checkedItems 
                                : selection;
               // return `${selection.checkedItems.length} options selected`;
                // console.log('more than one selections', selection.checkedItems);
                // _.forEach(selection.checkedItems, function(value, key) {
                //     console.log('key=',key, 'value=' ,value);
                //     selectedItems.push(value.text)
                //   });

               //return `${selectedItems.join()}`;
        }
    }

    getAllCheckboxText(): string {
        return 'All';
    }

    getFilterPlaceholder(): string {
        return 'Filter';
    }

    getFilterNoItemsFoundText(): string {
        return 'No items found';
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return isCollapse ? 'Expand' : 'Collapse';
    }
}
