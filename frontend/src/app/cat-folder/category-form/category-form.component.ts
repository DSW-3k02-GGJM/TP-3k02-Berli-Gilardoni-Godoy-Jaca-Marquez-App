import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';
import { CategoryCreatedOrModifiedService } from '../category-created-or-modified/cat.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class CategoryFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentCategoryId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private categoryCreatedOrModifiedService: CategoryCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  categoryForm = new FormGroup({
    categoryName: new FormControl('', [Validators.required]),
    categoryDescription: new FormControl('', [Validators.required]),
    pricePerDay: new FormControl('', [Validators.required]),
    depositValue: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.categoryCreatedOrModifiedService.isDataLoaded = false;

    if (this.currentCategoryId != -1) {
      this.apiService
        .getOne('categories', Number(this.currentCategoryId))
        .subscribe((response) => {
          this.categoryForm.patchValue(response.data);
        });
      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action == 'Create') {
      this.apiService
        .create('categories', this.categoryForm.value)
        .subscribe((response) => {
          this.categoryCreatedOrModifiedService.notifyCategoryCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('categories', this.currentCategoryId, this.categoryForm.value)
        .subscribe((response) => {
          this.categoryCreatedOrModifiedService.notifyCategoryCreatedOrModified();
        });
    }
    this.categoryCreatedOrModifiedService.isDataLoaded = true;
  }
}
