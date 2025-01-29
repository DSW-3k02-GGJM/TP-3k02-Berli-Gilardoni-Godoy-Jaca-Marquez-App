export interface GenericDialog {
  width: string;
  enterAnimationDuration: string;
  exitAnimationDuration: string;
  data: DialogData;
}

export interface DialogData {
  id?: number;
  title: string;
  titleColor: string;
  image: string;
  message?: string;
  showBackButton: boolean;
  backButtonTitle?: string;
  mainButtonTitle: string;
  mainButtonColor?: string;
  haveRouterLink: boolean;
  goTo?: string;
  showCheckOutFields?: boolean;
  initialKms?: number;
  finalKms?: number;
  returnDeposit?: boolean;
}

export interface ErrorDialogOptions {
  message: string;
  goTo?: string;
}

export interface DeleteDialogOptions {
  entity: string;
  message: string;
}

export interface SuccessDialogOptions {
  title: string;
  message?: string;
  goTo: string;
}
