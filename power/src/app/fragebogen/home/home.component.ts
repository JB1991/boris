import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'power-formulars-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle('LGLN - POWER.NI');
  }

  ngOnInit() {
  }
}
