import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [AuthService]
})
export class RegisterComponent {

  constructor(private authService: AuthService) { }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.authService.register(this.registerForm.value).subscribe(
      response => {
        console.log(response);
      });
  }
}
