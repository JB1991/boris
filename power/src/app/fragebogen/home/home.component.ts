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

  /**
   * Redirects to formular fillout dialogue
   * @param pin Formular pin
   */
  submitPIN(pin: string) {
    this.router.navigate(['/forms', 'fillout', pin], { replaceUrl: true });
  }
}
