import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'power-formulars-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) {
    this.titleService.setTitle('LGLN - POWER.NI');
  }

  ngOnInit() {
  }
}
