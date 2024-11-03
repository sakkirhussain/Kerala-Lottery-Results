import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../services/data.service';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

declare var adsbygoogle: any;
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  constructor(
    public dataService: DataService,
    public firestore: Firestore,
    public router: Router,
    private datePipe: DatePipe
  ) {}
  currentDate: any;
  lotteries: any;
  paginatedLotteries: any = [];
  currentPage = 0;
  itemsPerPage = 16;
  totalPages = 0;
  isScrolled = false;
  async ngOnInit(): Promise<void> {
    this.lotteries = await this.dataService.fetchData();
    this.sortLotteriesByDate();
    this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.totalPages = Math.ceil(this.lotteries.length / this.itemsPerPage);
    this.updatePagination();
  }

  sortLotteriesByDate() {
    this.lotteries.sort((a: any, b: any) => {
      return (
        this.parseDate(b.draw_date).getTime() -
        this.parseDate(a.draw_date).getTime()
      );
    });
  }

  private parseDate(dateString: string): Date {
    const parts = dateString.split('/');
    const day = +parts[0];
    const month = +parts[1] - 1;
    const year = +parts[2];
    return new Date(year, month, day);
  }

  goToResult(id: number) {
    this.router.navigate(['/result', id]);
  }

  isNew(drawDate: string): boolean {
    return drawDate === this.currentDate;
  }

  updatePagination() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLotteries = this.lotteries.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollOffset > 100; // 100px scroll threshold
  }
}
