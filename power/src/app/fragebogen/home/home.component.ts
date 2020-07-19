import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'power-formulars-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public titleService: Title, public router: Router) {
    this.titleService.setTitle('Formulare - POWER.NI');
  }

  ngOnInit() {
  }

  /**
   * Redirects to formular fillout dialogue
   * @param pin Formular pin
   */
  submitPIN(pin: string) {
    if (!pin) {
      throw new Error('pin is required');
    }
    this.router.navigate(['/forms', 'fillout', encodeURIComponent(pin)], { replaceUrl: true });
  }
}
