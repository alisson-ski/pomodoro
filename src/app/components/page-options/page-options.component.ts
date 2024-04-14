import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PomodoroService } from '../../services/pomodoro.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-options',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './page-options.component.html',
  styleUrl: './page-options.component.scss'
})
export class PageOptionsComponent implements AfterViewInit, OnInit {
  @ViewChild('dialog', { static: true }) dialog: ElementRef<HTMLDialogElement> | undefined = undefined;

  form: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private pomodoroService: PomodoroService) {}

  ngAfterViewInit(): void {
    //this.openDialog();
    this.dialog?.nativeElement.addEventListener('click', (event) => {
      if (event.target === this.dialog?.nativeElement) {
        this.closeDialog();
      }
    });
  }
  
  ngOnInit(): void {
    this.resetForm();
  }

  resetForm() {
    const timesInMinutes = this.pomodoroService.getTimesInMinutes();

    this.form = this.formBuilder.group({
      pomodoro: [timesInMinutes.pomodoro, [Validators.min(0.1), Validators.max(59)]],
      shortBreak: [timesInMinutes.shortBreak, [Validators.min(0.1), Validators.max(59)]],
      longBreak: [timesInMinutes.longBreak, [Validators.min(0.1), Validators.max(59)]],
    });
  }

  save() {
    const timesInMinutes = this.form.value;
    this.pomodoroService.setTimesInMinutes(timesInMinutes);
    this.closeDialog();
  }

  openDialog() {
    this.dialog?.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog?.nativeElement.close();
    this.resetForm();
  }
}
