import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  collapse = false;
  title = 'colossiGUI';

  toggleCollapsed(): void {
    this.collapse = !this.collapse;
  }
}
