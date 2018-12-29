
import { Component, forwardRef, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, TemplateRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DropdownTreeviewComponent } from './treeview-dropdown-lib/dropdown-treeview.component';
import { TreeviewI18n, TreeviewConfig, TreeviewItemTemplateContext, TreeviewItem } from './treeview-dropdown-lib';
import { TreeviewHeaderTemplateContext } from './treeview-dropdown-lib/treeview-header-template-context';
import * as _ from 'lodash';

const noop = () => {
};

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownComponent),
  multi: true
};

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR]
})
export class DropdownComponent implements OnInit, ControlValueAccessor {

  @Input('name') name: string;
  @Input('searchable') searchable: boolean = true;
  @Input('data') data: Array<any>[];
  @Input('bindLabel') bindLabel: string;
  @Input('bindValue') bindValue: string;
  @Input('placeholder') placeholder: string ="Please Select";
  @Input('multiple') multiple: boolean = false;
  @Input('treeview') treeview: boolean = false;
  

  @Input() buttonClass = 'btn-outline-secondary';
  @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
  @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
  @Input() items: TreeviewItem[];
  @Input() config: TreeviewConfig;
  @Output() selectedChange = new EventEmitter<any[]>(true);
  @Output() filterChange = new EventEmitter<string>();

  @Input("disabled") dropdownEnabled : boolean = true;

  @ViewChild(DropdownComponent) dropdown: DropdownComponent;

  //The internal data model
  private innerValue: any = '';

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private onTouchedCallback: (_?: any) => void = noop;
  private onChangeCallback: (_: any) => void = noop;


  constructor() {
  }

  ngOnInit() {
  }

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  onSelectedChange(event){
    this.selectedChange.emit(event);
    let val = _.map(event, d => d.item.value);
    this.onChangeCallback(val);
    this.onTouchedCallback(val);
  }

  onFilterChange(event){
    this.filterChange.emit(event);
  }

}
