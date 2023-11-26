import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  @Output() onSearch = new EventEmitter<string>();
  searchStream$ = new Subject<string>();
  inputValue = '';

  constructor() {}

  ngOnInit(): void {
    this.searchStream$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.onSearch.emit(value);
      });
  }

  public handleInputChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement)) return;
    this.searchStream$.next(target.value);
  }
}
