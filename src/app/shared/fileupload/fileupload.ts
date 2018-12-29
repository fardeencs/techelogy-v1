import {
    NgModule, Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef, AfterViewInit, AfterContentInit,
    ContentChildren, QueryList, ViewChild, ElementRef, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { DomHandler } from './dom/domhandler';
import { Message } from './message';
import { PrimeTemplate } from './shared';

export interface BlockableUI {
    getBlockableElement(): HTMLElement;
}

@Component({
    selector: 'p-fileUpload',
    templateUrl: 'fileupload.html',
    providers: [DomHandler]
})
export class FileUpload implements OnInit, AfterViewInit, AfterContentInit, OnDestroy, BlockableUI {

    @Input() name: string;

    @Input() url: string;

    @Input() method: string = 'POST';

    @Input() multiple: boolean;

    @Input() accept: string;

    @Input() disabled: boolean;

    @Input() auto: boolean;

    @Input() withCredentials: boolean;

    @Input() maxFileSize: number;

    @Input() maxFileWidth: number;

    @Input() maxFileHeight : number;

    @Input() invalidFileDimensionMessageSummary: string = '{0}: Invalid image dimension, ';

    @Input() invalidFileDimensionMessageDetail: string = 'Maximum image dimension is {0}.';

    @Input() invalidFileSizeMessageSummary: string = '{0}: Invalid file size, ';

    @Input() invalidFileSizeMessageDetail: string = 'maximum upload size is {0}.';

    @Input() invalidFileTypeMessageSummary: string = '{0}: Invalid file type, ';

    @Input() invalidFileTypeMessageDetail: string = 'allowed file types: {0}.';

    @Input() style: string;

    @Input() styleClass: string;

    @Input() previewWidth: number = 50;

    @Input() chooseLabel: string = 'Choose';

    @Input() uploadLabel: string = 'Upload';

    @Input() cancelLabel: string = 'Cancel';

    @Input() showUploadButton: boolean = true;

    @Input() showCancelButton: boolean = true;

    @Input() mode: string = 'advanced';

    @Input() customUpload: boolean;

    @Output() onBeforeUpload: EventEmitter<any> = new EventEmitter();

    @Output() onBeforeSend: EventEmitter<any> = new EventEmitter();

    @Output() onUpload: EventEmitter<any> = new EventEmitter();

    @Output() onError: EventEmitter<any> = new EventEmitter();

    @Output() onClear: EventEmitter<any> = new EventEmitter();

    @Output() onRemove: EventEmitter<any> = new EventEmitter();

    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    @Output() onProgress: EventEmitter<any> = new EventEmitter();

    @Output() uploadHandler: EventEmitter<any> = new EventEmitter();

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    @ViewChild('advancedfileinput') advancedFileInput: ElementRef;

    @ViewChild('basicfileinput') basicFileInput: ElementRef;

    @ViewChild('content') content: ElementRef;

    @Input() files: File[];

    public progress: number = 0;

    public dragHighlight: boolean;

    public msgs: Message[];

    public fileTemplate: TemplateRef<any>;

    public contentTemplate: TemplateRef<any>;

    public toolbarTemplate: TemplateRef<any>;

    focus: boolean;

    duplicateIEEvent: boolean;  // flag to recognize duplicate onchange event for file input

    constructor(private el: ElementRef, public domHandler: DomHandler, public sanitizer: DomSanitizer, public zone: NgZone) { }

    ngOnInit() {
        this.files = [];
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'file':
                    this.fileTemplate = item.template;
                    break;

                case 'content':
                    console.log('111', item.template);
                    this.contentTemplate = item.template;
                    break;

                case 'toolbar':
                    this.toolbarTemplate = item.template;
                    break;

                default:
                    this.fileTemplate = item.template;
                    break;
            }
        });

        console.log(this.contentTemplate);
    }

    ngAfterViewInit() {
        if (this.mode === 'advanced') {
            this.zone.runOutsideAngular(() => {
                this.content.nativeElement.addEventListener('dragover', this.onDragOver.bind(this));
            });
        }
    }

    onFileSelect(event) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }

        this.msgs = [];
        if (!this.multiple) {
            this.files = [];
        }

        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                    }

                    this.files.push(files[i]);
                }
            }
        }

        this.onSelect.emit({ originalEvent: event, files: files });

        if (this.hasFiles() && this.auto) {
            this.upload();
        }

        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        } else {
            this.clearInputElement();
        }
    }

    isFileSelected(file: File): boolean {
        for (let sFile of this.files) {
            if ((sFile.name + sFile.type + sFile.size) === (file.name + file.type + file.size)) {
                return true;
            }
        }

        return false;
    }

    isIE11() {
        return !!window['MSInputMethodContext'] && !!document['documentMode'];
    }

    validate(file: File): boolean {


        if (this.accept && !this.isFileTypeValid(file)) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
            });
            return false;
        }

        if (this.maxFileSize && file.size > this.maxFileSize) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
            });
            return false;
        }
        
        if (this.isImage(file) && (this.maxFileHeight  || this.maxFileWidth)) {
            let self = this;
            let url: any = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
            this.getMeta(url.changingThisBreaksApplicationSecurity, function (width, height) {

                if ((self.maxFileHeight  && self.maxFileWidth) && ((width > self.maxFileWidth) || (height > self.maxFileHeight))) {
                    self.msgs.push({
                        severity: 'error',
                        summary: self.invalidFileDimensionMessageSummary.replace('{0}', file.name),
                        detail: self.invalidFileDimensionMessageDetail.replace('{0}', (self.maxFileWidth+"px * "+self.maxFileHeight+"px"))
                    });
                    return false;
                }

                if ((self.maxFileWidth) && ((width > self.maxFileWidth))) {
                    self.msgs.push({
                        severity: 'error',
                        summary: self.invalidFileDimensionMessageSummary.replace('{0}', file.name),
                        detail: self.invalidFileDimensionMessageDetail.replace('{0}', (self.maxFileHeight+"px"))
                    });
                    return false;
                }

                if ((self.maxFileHeight ) && ((height > self.maxFileHeight ))) {
                    self.msgs.push({
                        severity: 'error',
                        summary: self.invalidFileDimensionMessageSummary.replace('{0}', file.name),
                        detail: self.invalidFileDimensionMessageDetail.replace('{0}', (self.maxFileHeight+"px"))
                    });
                    return false;
                }
            });
        }

        return false;

        return true;
    }

    private isFileTypeValid(file: File): boolean {
        let acceptableTypes = this.accept.split(',');
        for (let type of acceptableTypes) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type)
                : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

            if (acceptable) {
                return true;
            }
        }

        return false;
    }

    private getMeta(url, callback) {
        const img = new Image();
        img.src = url;
        img.onload = function () { callback(img.width, img.height); }
    }

    getTypeClass(fileType: string): string {
        return fileType.substring(0, fileType.indexOf('/'));
    }

    isWildcard(fileType: string): boolean {
        return fileType.indexOf('*') !== -1;
    }

    getFileExtension(file: File): string {
        return '.' + file.name.split('.').pop();
    }

    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    onImageLoad(img: any) {
        window.URL.revokeObjectURL(img.src);
    }

    upload() {
        if (this.customUpload) {
            this.uploadHandler.emit({
                files: this.files
            });
            this.clear();
        }
        else {
            this.msgs = [];
            let xhr = new XMLHttpRequest(),
                formData = new FormData();

            this.onBeforeUpload.emit({
                'xhr': xhr,
                'formData': formData
            });

            for (let i = 0; i < this.files.length; i++) {
                formData.append(this.name, this.files[i], this.files[i].name);
            }

            xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
                if (e.lengthComputable) {
                    this.progress = Math.round((e.loaded * 100) / e.total);
                }

                this.onProgress.emit({ originalEvent: e, progress: this.progress });
            }, false);

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    this.progress = 0;

                    if (xhr.status >= 200 && xhr.status < 300)
                        this.onUpload.emit({ xhr: xhr, files: this.files });
                    else
                        this.onError.emit({ xhr: xhr, files: this.files });

                    this.clear();
                }
            };

            xhr.open(this.method, this.url, true);

            this.onBeforeSend.emit({
                'xhr': xhr,
                'formData': formData
            });

            xhr.withCredentials = this.withCredentials;

            xhr.send(formData);
        }
    }

    clear() {
        this.files = [];
        this.onClear.emit();
        this.clearInputElement();
    }

    remove(event: Event, index: number) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this.files[index] });
        this.files.splice(index, 1);
    }

    clearInputElement() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.advancedFileInput.nativeElement.value = '';
        }

        if (this.basicFileInput && this.basicFileInput.nativeElement) {
            this.basicFileInput.nativeElement.value = '';
        }
    }

    clearIEInput() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            this.advancedFileInput.nativeElement.value = '';
        }
    }

    hasFiles(): boolean {
        return this.files && this.files.length > 0;
    }

    onDragEnter(e) {
        if (!this.disabled) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragOver(e) {
        if (!this.disabled) {
            this.domHandler.addClass(this.content.nativeElement, 'ui-fileupload-highlight');
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragLeave(event) {
        if (!this.disabled) {
            this.domHandler.removeClass(this.content.nativeElement, 'ui-fileupload-highlight');
        }
    }

    onDrop(event) {
        if (!this.disabled) {
            this.domHandler.removeClass(this.content.nativeElement, 'ui-fileupload-highlight');
            event.stopPropagation();
            event.preventDefault();

            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple || (files && files.length === 1);

            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }

    onFocus() {
        this.focus = true;
    }

    onBlur() {
        this.focus = false;
    }

    formatSize(bytes) {
        if (bytes == 0) {
            return '0 B';
        }
        let k = 1000,
            dm = 3,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    onSimpleUploaderClick(event: Event) {
        if (this.hasFiles()) {
            this.upload();
        }
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    ngOnDestroy() {
        if (this.content && this.content.nativeElement) {
            this.content.nativeElement.removeEventListener('dragover', this.onDragOver);
        }
    }
}

