import { Component } from '@angular/core';
import { PomodoroService, Steps } from '../../services/pomodoro.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {
  
  buttons = [{
    label: 'Pomodoro',
    step: Steps.POMODORO
  },{
    label: 'Pausa Curta',
    step: Steps.SHORT_BREAK
  },{
    label: 'Pausa Longa ',
    step: Steps.LONG_BREAK
  }];

  constructor(public pomodoroService: PomodoroService) { }

  setStep(step: Steps) {
    this.pomodoroService.setStep(step);
  }
}
