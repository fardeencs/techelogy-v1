import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {environment} from "../../environments/environment";


@Injectable()
export class HttpInterceptorClass implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const baseUrl = environment.REST_URL;
    console.log(req);
    const url = req.url.indexOf('/i18n/') != -1 ? `${req.url}`: `${baseUrl}/${req.url}`;
    const apiReq  = req.clone({ url:url});
    return next.handle(apiReq).pipe(tap(
      (response) => {
        if (response instanceof HttpResponse) {

        }
      },
      (error) => {
      }));
  }
}
