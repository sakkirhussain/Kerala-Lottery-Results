import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogs: any[] = [];

  constructor(public dataService: DataService) {}

  async ngOnInit(): Promise<void> {
    this.blogs = await this.dataService.fetchBlog();
    this.blogs.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });

    this.blogs = this.blogs.map((blog) => ({ ...blog, showFullText: false }));
  }

  toggleText(index: number) {
    this.blogs[index].showFullText = !this.blogs[index].showFullText;
  }
}
