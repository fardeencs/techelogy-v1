import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, HostListener, ViewEncapsulation, ElementRef
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';


import { PAGINATION, STATE_EVENT } from '../../modules/constants';
import { GlobalState } from "../../global.state";

declare var $: any;

@Component({
  selector: 'app-dt-server-side',
  templateUrl: './datatable-serverside.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datatable-serverside.component.scss']

})

/**
 * Class which provide datatable functionalities
 */
export class DTServersideComponent implements OnChanges {

  @Input() rows;
  @Input() columns;
  @Input() height: Number;
  @Input() isLoading: boolean;
  @Input() scrollBarV = false;
  @Input() scrollBarH = false;
  @Input() columnMode;
  @Input() showPageinator: boolean = true;
  @Input() showPageLimit: boolean = true;
  @Input() totalRecords: number;
  @Input() pageSize: number;
  @Input() pageNumber: number;
  @Input() sortedColumn : Array<Object> = [];
  @Output() pageChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Output() rowSelect: EventEmitter<any> = new EventEmitter();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  private readonly DATATABLE_BODY_CSS_SELECTOR = '.datatable-body';
  pageLimit = PAGINATION.PAGE_ITEM_SIZE[0];
  pageSizeOptions = PAGINATION.PAGE_ITEM_SIZE;
  currentPaginationNum = 1;
  rotate = true;
  maxSize = 3;
  currentPage = 1;
  offsetX : any;
  sortedColumArr:Array<Object> = [];
  @ViewChild(DatatableComponent) dtTable: DatatableComponent;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    setTimeout(() => {
      this.table.recalculate();
    }, 250);
  }

  constructor(private _globalState: GlobalState
    , private elementRef: ElementRef) {
    this.isLoading = this.isLoading || false;
    this.height = this.height || 550;
    this.columnMode = this.columnMode || 'force';
    this.showPageinator = this.showPageinator || true;
    this.showPageLimit = this.showPageLimit || true;
    if (this.showPageLimit) {
      this.pageLimit = this.pageSize;
    }

    // calling manually to resize datatable
    this._globalState.subscribe(STATE_EVENT.RESIZE_DATATABLE,
      (calledBy) => {
        setTimeout(() => {
          this.table.recalculate();
          this.resizeWindow();
        }, 500);
      });


  }


     /**
   * on grid scroll
   */
  onGridScroll(scroll: any) {
    const offsetX = scroll.offsetX;
    if (offsetX != null) {
      this.offsetX = offsetX;
    }
  }

  scrollX(offsetX: number) {
    let dataTableBodyDom = this.elementRef.nativeElement.querySelector(this.DATATABLE_BODY_CSS_SELECTOR);
    dataTableBodyDom.scrollLeft = offsetX;
  }

  /**
   * An function is called when page change event triegger in pageination
   */
  onPageChange(event: any) {
    this.dtTable.limit = event.itemsPerPage;
    this.dtTable.recalculate();
    this.pageChangeEvent.emit(event);
  }

  /**
  * An function is called when sort happen in datatable
  */
  onSort($event) {
    this.sort.emit($event);
  }

  /**
   * An function is called when row select happen in datatable
   */
  onSelect($event) {
    this.rowSelect.emit($event);
  }

  /**
   * An function is called when page limit change happen in datatable
   */
  onPageLimitChange($event) {
    this.onPageChange({ page: 1, itemsPerPage: Number($event.target.value) });
  }

  /**
   * on change event
   */
  ngOnChanges(changes: SimpleChanges) {
    const isLoading = changes['isLoading'] || false;
    if (isLoading) {
      if (isLoading['currentValue'] !== isLoading['previousValue']) {
        if (!isLoading['currentValue']) {
          setTimeout(() => {
            this.table.recalculate();
            this.resizeWindow();
            if(this.offsetX)
              this.scrollX(this.offsetX);
          }, 0);
        }
      }
    }

    // set default page size
    const pageSize = changes['pageSize'] || this.pageSizeOptions[0];
    if (pageSize) {
      if (pageSize['currentValue'] !== pageSize['previousValue']) {
        this.pageLimit = pageSize['currentValue'];
      }
    }

    // set default page number
    const pageNumber = changes['pageNumber'] || 0;
    if (pageNumber) {
      if (pageNumber['currentValue'] !== pageNumber['previousValue']) {
        const curPage = Number(pageNumber['currentValue']) +  1;
        setTimeout(() => {
          this.currentPaginationNum = curPage;
        }, 0);
      }
    }

    // check data is changed then set page number
    const rows = changes['rows'] || '';
    if (rows) {
      if (rows['currentValue'] !== rows['previousValue']) {
        setTimeout(() => {
          this.currentPage = this.currentPaginationNum;
        }, 0);
      }
    }

    // get sorted column
    const sortedColumn = changes['sortedColumn'] || [];
    if (sortedColumn) {
      if (sortedColumn['currentValue'] !== sortedColumn['previousValue']) {
        setTimeout(() => {
          this.sortedColumArr = this.sortedColumn;
          this.setSortedColIcon();
        }, 100);
      }
    }
  }


  /**
   * HACK :: set icon for sorted column
   */
  setSortedColIcon() {
    if(this.sortedColumArr && this.sortedColumArr.length > 0){
      const col = this.sortedColumArr[0]['value'] || '';
      const dir = this.sortedColumArr[0]['dir'] || '' ;
      const dirClass = (dir == 'asc') ? 'sort-asc datatable-icon-up' : 'sort-desc datatable-icon-down' ;
      $(".datatable-header-cell-template-wrap .sort-btn").removeClass("sort-asc datatable-icon-up sort-desc datatable-icon-down");
      $(".datatable-header-cell-template-wrap ."+col).next('.sort-btn').addClass(dirClass);
    }
  }

  /**
   * on window resize event
   */
  resizeWindow() {
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      const evt = document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);

    } else {
      window.dispatchEvent(new Event('resize'));

    }
  }

}
