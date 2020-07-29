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
    // Spam protection: Replace ++ with + and @@ with @ in the mail address (only effective for bots without JavaScript)
    document.body.innerHTML = document.body.innerHTML
      .replace(/\+\+/g, '+')
      .replace(/@@/g, '@');
  }
}
