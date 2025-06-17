import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

 constructor( private userService: UserService,
	      private router: Router
    )
 {
 }

 myNewUser = new User();

createUser() {
    // Validamos que el email, nombre y contraseña no estén vacíos
    if (!this.myNewUser.email || !this.myNewUser.username || !this.myNewUser.password) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    // Aquí se llama al servicio para crear un nuevo usuario
    this.userService.createUser(this.myNewUser).subscribe({
      next: (res) => {
        console.log('Usuario creado:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
      }
    });
  }

}
