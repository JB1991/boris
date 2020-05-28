import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'power-formulars-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) {
    this.titleService.setTitle('LGLN - POWER.NI');
  }

  ngOnInit() {
  }

  submitFormular(value: string) {
    this.router.navigate(['formulare', 'fillout', value], { replaceUrl: true });
  }
}
