import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  public currentpage = 1;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
  }

  /**
   * Returns true if page id is currently active
   * @param id id of webpage in menu
   */
  public isPage(id: number): boolean {
    const title = this.titleService.getTitle();

    // compare page titles
    if (id === 1 && title === 'LGLN - POWER.NI') {
      return true;
    } else if (id === 2 && title === 'Formular - POWER.NI') {
      return true;
    } else if (id === 3 && title === 'Formular Editor - POWER.NI') {
      return true;
    } else if (id === 0 && title === 'Dashboard - POWER.NI') {
      return true;
    }

    return false;
  }
}
