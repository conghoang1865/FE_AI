import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreFormDemoComponent } from './core/form-demo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreFormDemoComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FE');
}
