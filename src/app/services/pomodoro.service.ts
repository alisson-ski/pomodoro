import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum Steps {
  POMODORO,
  SHORT_BREAK,
  LONG_BREAK
}

export interface TimesInMinutes {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
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
    [Steps.POMODORO]: 0,
    [Steps.SHORT_BREAK]: 0,
    [Steps.LONG_BREAK]: 0,
  }

  timeEndedNotifications = {
    [Steps.POMODORO]: {title: 'Pomodoro finalizado', body: 'Hora de uma pausa!' },
    [Steps.SHORT_BREAK]: {title: 'Pausa curta finalizada', body: 'Hora de voltar ao trabalho!' },
    [Steps.LONG_BREAK]: {title: 'Pausa longa finalizada', body: 'Hora de voltar ao trabalho!' },
  }

  worker: Worker | undefined;

  constructor() {
    this.reset();
  }

  reset() {
    if (typeof window !== 'undefined') {
      this.setupTimes();
    }

    this.setStep(Steps.POMODORO);
    this.pomodoroCount = 0;
    this.worker?.terminate();
    clearInterval(this.interval);
    this._isTimerRunning.next(false);
  }

  setupTimes() {
    const timesInMinutesRawValue = localStorage.getItem('timesInMinutes')
    const timesInMinutes: TimesInMinutes = JSON.parse(timesInMinutesRawValue || '{}');

    this.stepTimes = {
      [Steps.POMODORO]: (timesInMinutes.pomodoro * 60) || 1500,
      [Steps.SHORT_BREAK]: (timesInMinutes.shortBreak * 60) || 300,
      [Steps.LONG_BREAK]: (timesInMinutes.longBreak * 60) || 900,
    }    
  }

  askNotificationPermission() {
    if (typeof window == 'undefined') return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;

    window.alert('Por favor, habilite as notificações para ser avisado quando o tempo acabar.');
    Notification.requestPermission();
  }

  notify() {
    if (typeof window == 'undefined') return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    
    const step = this._currentStep.value;
    new Notification(this.timeEndedNotifications[step].title, {
      body: this.timeEndedNotifications[step].body
    });

    let audio = new Audio('../../assets/sounds/bell.mp3');
    audio.play();
  }

  startTimer() {
    this.askNotificationPermission();

    this._isTimerRunning.next(true);
    this.lowerOneSecond();

    if (typeof Worker !== 'undefined') {
      this.createWebWorker();
    } else {
      this.createInterval();
    }
  }

  createWebWorker() {
    this.worker = new Worker(new URL('../app.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        if (data !== 'tick') return;

        this.lowerOneSecond();
        if (this._seconds.value < 1) {
          this.worker!.terminate();
          this.onCountEnd();
        }

      };
    this.worker.postMessage('start');
  }

  createInterval() {
    this.interval = setInterval(() => {
      this.lowerOneSecond();
      if (this._seconds.value < 1) {
        clearInterval(this.interval);
        this.onCountEnd();
      }
    }, 1000);
  }

  stopTimer() {
    this._isTimerRunning.next(false);
    this.worker?.terminate();
    clearInterval(this.interval);
  }

  lowerOneSecond() {
    const nextSecondsValue = this._seconds.value - 1;
    this._seconds.next(nextSecondsValue);
  }

  onCountEnd() {
    this.notify();

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

  setStep(step: Steps) {
    this.stopTimer();
    this._seconds.next(this.stepTimes[step]);
    this._currentStep.next(step);
  }

  getTimesInMinutes(): TimesInMinutes {
    const timesInMinutes = {
      pomodoro: this.stepTimes[Steps.POMODORO] / 60,
      shortBreak: this.stepTimes[Steps.SHORT_BREAK] / 60,
      longBreak: this.stepTimes[Steps.LONG_BREAK] / 60
    };

    return timesInMinutes;
  }

  setTimesInMinutes(timesInMinutes: TimesInMinutes) {
    this.stepTimes = {
      [Steps.POMODORO]: timesInMinutes.pomodoro * 60,
      [Steps.SHORT_BREAK]: timesInMinutes.shortBreak * 60,
      [Steps.LONG_BREAK]: timesInMinutes.longBreak * 60
    };

    if (!this._isTimerRunning.value) {
      this.setStep(this._currentStep.value);
    }

    localStorage.setItem('timesInMinutes', JSON.stringify(timesInMinutes));
  }
}
