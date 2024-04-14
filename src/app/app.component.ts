import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './components/timer/timer.component';
import { ActionsComponent } from './components/actions/actions.component';
import { ExplanationComponent } from './components/explanation/explanation.component';
import { CreditsComponent } from './components/credits/credits.component';
import { PageOptionsComponent } from './components/page-options/page-options.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TimerComponent,
    ActionsComponent,
    ExplanationComponent,
    CreditsComponent,
    PageOptionsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor() { }
}
