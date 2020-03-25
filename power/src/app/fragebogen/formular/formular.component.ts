import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'power-formulars-formular',
  templateUrl: './formular.component.html',
  styleUrls: ['./formular.component.css']
})


export class FormularComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) {
    this.titleService.setTitle('Formular - POWER.NI');
  }

  ngOnInit() {
  }

  onSubmit(value: string) {
    this.router.navigateByUrl('formular/' + value);
  }
}
