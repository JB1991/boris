import { Component, OnInit } from '@angular/core';
import { LoadingscreenService } from '../loadingscreen/loadingscreen.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public loadingscreen: LoadingscreenService) { }

  ngOnInit() {
  }
}
