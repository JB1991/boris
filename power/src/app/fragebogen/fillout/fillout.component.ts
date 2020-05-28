import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'power-formulars-fillout',
  templateUrl: './fillout.component.html',
  styleUrls: ['./fillout.component.css']
})
export class FilloutComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) {
    this.titleService.setTitle('LGLN - POWER.NI');
  }

  ngOnInit() {
  }
}
