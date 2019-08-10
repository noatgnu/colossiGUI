import { Component } from '@angular/core';
import {AnnouncementService} from './service/announcement.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  collapse = false;
  title = 'colossiGUI';
  ant: Observable<string>;
  constructor(private annoucement: AnnouncementService) {
    this.ant = this.annoucement.annoucementReader;
  }
  toggleCollapsed(): void {
    this.collapse = !this.collapse;
  }
}
