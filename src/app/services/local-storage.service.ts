
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
    constructor() { }
    /**
     * Will set the data into session storage
     * @storageKey: The key against which the data is to store
     * @datal: The data to store
     */
    set(storageKey, data) {
        if (typeof (Storage) !== 'undefined') {
            localStorage[storageKey] = data;
        } else {
            alert('Sorry, your browser does not support web storage...');
        }
    }

    /**
     * Will get the data from session storage
     * @storageKey: The key against which the data is stored
     */
    get(storageKey) {
        return localStorage[storageKey];
    }

    /**
     * Will remove the data from session storage
     * @storageKey: The key against which the data is stored
     */
    remove(storageKey) {
        delete localStorage[storageKey];
    }
}
