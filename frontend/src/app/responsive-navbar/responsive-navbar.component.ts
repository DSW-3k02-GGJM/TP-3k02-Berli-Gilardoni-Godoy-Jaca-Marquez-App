import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from "../service/auth.service";
import {CommonModule} from "@angular/common";
import {catchError, map, Observable, of, Subscription,} from "rxjs";
import {SuccessfulModalComponent} from "../user-folder/successful-modal/successful-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-responsive-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './responsive-navbar.component.html',
  styleUrl: './responsive-navbar.component.scss',
})
export class ResponsiveNavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private modalService: NgbModal
  ) { }
  isLogged = false;
  profileLink = '/home';
  private subscription?: Subscription;
  private subscription2?: Subscription;


  ngOnInit() {
    this.subscription =
      this.authService.loginOrLogout.subscribe(
        () => {
          
          this.isLogged = this.authService.isLogged;
          this.authService.getAuthenticatedId().subscribe(
            response => {
              this.profileLink = '/user/' + response.id
            },
            error => {
              this.profileLink = '/home';
              console.log(error);
            }
          );
        }
      );

    if(!this.authService.isLogged) {
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
        const modalRef = this.modalService.open(SuccessfulModalComponent, { centered: true });
        modalRef.componentInstance.title = 'Logout exitoso';
        console.log(res);
    });
  }
}
