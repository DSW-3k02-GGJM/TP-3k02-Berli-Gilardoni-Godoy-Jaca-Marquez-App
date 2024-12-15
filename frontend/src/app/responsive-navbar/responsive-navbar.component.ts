import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from "../service/auth.service";
import {CommonModule} from "@angular/common";
import {catchError, map, Observable, of, Subscription,} from "rxjs";
import {SuccessfulModalComponent} from "../user-folder/successful-modal/successful-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { MatDialog } from '@angular/material/dialog';
import { GenericSuccesDialogComponent } from '../shared/generic-succes-dialog/generic-succes-dialog.component.js';

@Component({
  selector: 'app-responsive-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule,],
  templateUrl: './responsive-navbar.component.html',
  styleUrl: './responsive-navbar.component.scss',
})
export class ResponsiveNavbarComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(GenericSuccesDialogComponent, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      data:{
        title: 'Logout exitoso',
        haveRouterLink: true,
        goTo: '/home'
      }
    });
  }
  constructor(
    private authService: AuthService,
    private modalService: NgbModal
  ) { }
  isLogged = false;
  isAdminOrEmployee = false;
  profileLink = '/home';
  private subscription?: Subscription;


  ngOnInit() {
    this.subscription =
      this.authService.loginOrLogout.subscribe(
        () => {
          
          this.isLogged = this.authService.isLogged;
          if(!this.isLogged) {
            this.isAdminOrEmployee = false;
          }
          this.authService.getAuthenticatedId().subscribe(
            response => {
              this.profileLink = '/user/' + response.id
            },
            error => {
              this.profileLink = '/home';
              console.log(error);
            }
          );
          this.authService.checkEmployee().subscribe({
            next: response => {
              this.isAdminOrEmployee = true
            }
          });
        }
      );

    if(!this.authService.isLogged) {
      this.isAdminOrEmployee = false;
      this.isLogged = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout()
      .subscribe(
      res => {
        this.openDialog();
        console.log(res);
    });
  }
}

