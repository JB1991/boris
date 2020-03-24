import { Component, OnInit } from '@angular/core';
import { LoadingscreenService } from './loadingscreen.service';

@Component({
  selector: 'app-loadingscreen',
  templateUrl: './loadingscreen.component.html',
  styleUrls: ['./loadingscreen.component.css']
})
export class LoadingscreenComponent implements OnInit {

  constructor(public loadingscreen: LoadingscreenService) { }

  ngOnInit(): void {
  }

}
