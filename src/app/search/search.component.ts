import { Component } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { FilterService } from '../services/filter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfettiService } from '../services/confetti.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [DatePipe],
})
export class SearchComponent {
  resultMessage: string = '';
  cardState = 'hidden';
  searchForm: FormGroup;
  inputNumber: string = '';
  selectedDate: Date | null = null;
  showResult: boolean = false;
  isMatchFound: boolean = false;
  formattedDate: any;
  invalidDate: any = false;
  matchedItem: any;
  cardText: string = '';
  constructor(
    private datePipe: DatePipe,
    private filterService: FilterService,
    private fb: FormBuilder,
    private confettiService: ConfettiService,
    public router: Router
  ) {
    this.searchForm = this.fb.group({
      number: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      date: ['', Validators.required],
    });
  }

  async onCheckClick() {
    if (this.searchForm.valid) {
      this.invalidDate = false;
      const inputNumber = this.searchForm.get('number')?.value;
      const inputDate = this.searchForm.get('date')?.value;
      this.formattedDate = inputDate
        ? this.datePipe.transform(inputDate, 'dd/MM/yyyy')
        : 'No date selected';
      this.matchedItem = await this.filterService.search(
        inputNumber,
        this.formattedDate
      );
      if (this.matchedItem) {
        if (this.matchedItem == 'No') {
          this.cardText = 'No result available on this date';
          this.invalidDate = true;
          this.showResult = true;
          this.isMatchFound = false;
        } else {
          this.showResult = true;
          this.isMatchFound = true;
          this.confettiService.launchConfetti();
        }
      } else {
        this.cardText = 'NO PRIZE THIS TIME';
        this.showResult = true;
        this.isMatchFound = false;
      }
    } else {
    }
  }

  get f() {
    return this.searchForm.controls;
  }

  async goToResult() {
    const lottery = await this.filterService.getDocByDate(this.formattedDate);
    const id = lottery?.['lottery_serial_number'];
    this.router.navigate(['/result', id]);
  }
}
