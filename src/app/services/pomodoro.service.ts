import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';

export enum Steps {
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

  private _isTimerRunning = new BehaviorSubject<boolean>(false);
  isTimerRunning$ = this._isTimerRunning.asObservable();

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
    this._isTimerRunning.next(false);
  }

  startTimer() {
    this._isTimerRunning.next(true);
    this.lowerOneSecond();

    this.interval = setInterval(() => {
      this.lowerOneSecond();
      if (this._seconds.value === 0) {
        clearInterval(this.interval);
        this.onCountEnd();
      }
    }, 1000);
  }

  lowerOneSecond() {
    const nextSecondsValue = this._seconds.value - 1;
    this._seconds.next(nextSecondsValue);
  }

  onCountEnd() {
    if (this._currentStep.value !== Steps.POMODORO) {
      this.setStep(Steps.POMODORO);
      return;
    }
    
    this.pomodoroCount++;

    if (this.pomodoroCount === 4) {
      this.setStep(Steps.LONG_BREAK);
      this.pomodoroCount = 0;
      return;
    }

    this.setStep(Steps.SHORT_BREAK);
  }

  stopTimer() {
    this._isTimerRunning.next(false);
    clearInterval(this.interval);
  }

  setStep(step: Steps) {
    this.stopTimer();
    this._seconds.next(this.stepTimes[step]);
    this._currentStep.next(step);
  }
}
