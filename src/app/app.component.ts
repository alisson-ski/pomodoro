import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PomodoroService } from './services/pomodoro.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pomodoro';

  parsedMinutes$: Observable<string> | null = null;

  constructor(public pomodoroService: PomodoroService) {
    this.pomodoroService.reset();

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
