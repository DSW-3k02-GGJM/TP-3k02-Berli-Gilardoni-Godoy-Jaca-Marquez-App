// Angular
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Interfaces
import { DialogData } from '@shared/interfaces/generic-dialog.interface';

// Directives
import { PreventEnterDirective } from '@shared/directives/prevent-enter.directive';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  templateUrl: './generic-dialog.component.html',
  styleUrl: '../../styles/generic-dialog.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    PreventEnterDirective,
  ],
})
export class GenericDialogComponent implements OnDestroy {
  data: DialogData = inject(MAT_DIALOG_DATA);
  dialogRef: MatDialogRef<GenericDialogComponent> = inject(MatDialogRef);

  checkOutForm: FormGroup = new FormGroup(
    {
      finalKms: new FormControl(this.data.initialKms, [
        Validators.required,
        Validators.min((this.data.initialKms ?? 0) + 1),
      ]),
      returnDeposit: new FormControl(true, [Validators.required]),
    },
    { updateOn: 'blur' }
  );

  constructor(private readonly router: Router) {}

  ngOnDestroy(): void {
    if (this.data.haveRouterLink) {
      this.router.navigate([this.data.goTo]);
    }
  }

  confirm(): void {
    if (!this.checkOutForm.invalid) {
      this.data.finalKms = this.checkOutForm.get('finalKms')?.value;
      this.data.returnDeposit = this.checkOutForm.get('returnDeposit')?.value;
      this.dialogRef.close({ action: true });
    }
  }

  getAltText(imagePath: string): string {
    const fileName: string = imagePath.split('/').pop() || '';
    return fileName.split('.')[0];
  }
}
