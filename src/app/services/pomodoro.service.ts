import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';

enum Steps {
  POMODORO,
  SHORT_BREAK,
  LONG_BREAK
}

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {

  private _seconds = new BehaviorSubject<number>(0);
  seconds$ = this._seconds.asObservable();
  
  private _currentStep = new BehaviorSubject<Steps>(Steps.POMODORO);
  currentStep$ = this._currentStep.asObservable();

  pomodoroCount = 0;
  interval: NodeJS.Timeout | undefined = undefined;

  stepTimes = {
    [Steps.POMODORO]: 1500,
    [Steps.SHORT_BREAK]: 300,
    [Steps.LONG_BREAK]: 900
  }

  constructor() { }

  reset() {
    this.setStep(Steps.POMODORO);
    this.pomodoroCount = 0;
    clearInterval(this.interval);
  }

  startCount() {
    this.interval = setInterval(() => {
      const nextSecondsValue = this._seconds.value - 1;
      this._seconds.next(nextSecondsValue);

      if (nextSecondsValue === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  setStep(step: Steps) {
    this._seconds.next(this.stepTimes[step]);
    this._currentStep.next(step);
  }
}
