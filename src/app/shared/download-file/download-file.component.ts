import { Directive, Input, HostListener } from '@angular/core';
import { ExportService } from '../../services/export.service';
import { BaseComponent } from '../../components/base.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Directive({
  selector: '[downloadFile]'
})
/**
 * Directive which provide file download functionality
 */
export class DownloadFileDirective extends BaseComponent {

  @Input() path = '';
  @Input() action = '';
  @Input() ids: any;
  @Input() usex = '';
  constructor(
    private _exportService: ExportService,
    protected _router: Router,
    protected _location: Location) {
    super(_router, _location);
  }

  @HostListener('click', ['$event']) onClick($event) {
    this.click();
  }

  /**
   * Click event of host
   */
  click() {
    if (this.ids.length > 0) {
      try {
        if(this.usex=='1'){
          this._exportService.downloadLink(this.path, this.ids,this.action)
          .subscribe((response) => {
            this.downloadFileFromURL(response['location']);
          },(error) => {
            this.setError(error.message);
          });
        }else{
          this._exportService
          .getSelectedDownloadLink(this.path, this.action, this.ids)
          .subscribe((response) => {
            this.downloadFileFromURL(response['link']);
          },(error) => {
            this.setError(error.message);
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setError('NO_RECORD_SELECTED_FOR_EXPORT');
    }
  }

  /**
   * Create link url and download file
   */
  downloadFileFromURL(url) {
    try {
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      //console.log(error);
    }
  }
}
