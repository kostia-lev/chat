import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  getItem(key) {
    return localStorage.getItem(key) as string;
  }
}
