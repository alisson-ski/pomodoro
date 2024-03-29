import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PomodoroService } from './services/pomodoro.service';
import { Observable, map } from 'rxjs';
import { TimerComponent } from './components/timer/timer.component';
import { ActionsComponent } from './components/actions/actions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TimerComponent, ActionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public pomodoroService: PomodoroService) {
    this.pomodoroService.reset();
  }
}
