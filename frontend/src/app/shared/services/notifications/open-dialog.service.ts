// Angular
import { Injectable } from '@angular/core';

// Angular Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// Components
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

// Interfaces
import {
  DeleteDialogOptions,
  DialogData,
  ErrorDialogOptions,
  GenericDialog,
  SuccessDialogOptions,
} from '@shared/interfaces/generic-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class OpenDialogService {
  constructor(private readonly dialog: MatDialog) {}

  error(options: ErrorDialogOptions): void {
    this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: '¡Ups! Algo salió mal',
        titleColor: 'dark',
        image: 'assets/generic/wrongmark.png',
        message: options.message ?? 'Error de conexión',
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: options.goTo ? true : false,
        goTo: options.goTo ?? null,
      },
    } as GenericDialog);
  }

  delete(
    options: DeleteDialogOptions
  ): MatDialogRef<GenericDialogComponent, boolean> {
    return this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: `Eliminar ${options.entity}`,
        titleColor: 'danger',
        image: 'assets/generic/delete.png',
        message: options.message,
        showBackButton: true,
        backButtonTitle: 'Volver',
        mainButtonTitle: 'Eliminar',
        mainButtonColor: 'bg-danger',
        haveRouterLink: false,
      },
    } as GenericDialog);
  }

  success(options: SuccessDialogOptions): void {
    this.dialog.open(GenericDialogComponent, {
      width: options.message ? '350px' : '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: {
        title: options.title,
        titleColor: 'dark',
        image: 'assets/generic/checkmark.png',
        message: options.message,
        showBackButton: false,
        mainButtonTitle: 'Aceptar',
        haveRouterLink: true,
        goTo: options.goTo,
      },
    } as GenericDialog);
  }

  generic(
    dialogData: DialogData
  ): MatDialogRef<GenericDialogComponent, boolean> {
    return this.dialog.open(GenericDialogComponent, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data: dialogData,
    } as GenericDialog);
  }
}
