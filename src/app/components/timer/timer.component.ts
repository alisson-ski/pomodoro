import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PomodoroService } from '../../services/pomodoro.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {

  parsedMinutes$: Observable<string> | null = null;

  constructor(public pomodoroService: PomodoroService) {
    this.setupParsedMinutesObservable();
  }

  setupParsedMinutesObservable() {
    this.parsedMinutes$ = this.pomodoroService.seconds$.pipe(map((seconds => {
      const parsedMinutes = Math.floor(seconds / 60);
      const parsedSeconds = seconds % 60;

      return `${parsedMinutes < 10 ? '0' : ''}${parsedMinutes}:${parsedSeconds < 10 ? '0' : ''}${parsedSeconds}`
    })));
  }

  startCount() {
    this.pomodoroService.startCount();
  }
}
