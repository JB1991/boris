import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'power-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle('Portal für Wertermittlung Niedersachsen');
  }

  ngOnInit() {
  }

}
