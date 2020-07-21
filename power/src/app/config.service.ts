import { Injectable } from '@angular/core';

export interface Config {
  modules: Array<String>;
  authentication: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: Config;

  constructor() { }
}
