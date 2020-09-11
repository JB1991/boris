import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public tags: string[];
    public forms: any[];
    public tasks: any[];
}
