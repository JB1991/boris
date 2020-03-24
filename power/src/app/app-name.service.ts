import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppNameService {

  name = new Subject<string>();

  constructor() {
  }

  getName() {
    return this.name.asObservable();
  }

  updateName(name: string) {
    this.name.next(name);
  }

}
