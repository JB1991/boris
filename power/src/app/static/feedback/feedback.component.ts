import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'power-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(public titleService: Title) {
    this.titleService.setTitle('Rückmeldung geben - POWER.NI');
  }

  ngOnInit(): void {
  }
}
