//Dejar abierto el cypress.config.ts para que no de error

describe('Reservas - Test de Check-in', () => {
  it('Debería permitir hacer check-in de una reserva', () => {
    cy.visit('http://localhost:4200/login');
    
    // Login como admin
    cy.get('[formControlName="email"]').type('admin@admin.com');
    cy.get('[formControlName="password"]').type('admin');
    cy.get('[formControlName="email"]').focus();
    cy.get('button[type="submit"]').click();
    cy.contains('Aceptar').click();
    
    // Navegar hasta la pagina de usuarios
    cy.contains('Menú Staff').click();
    cy.contains('Usuarios').click();

    // Crear nuevo usuario
    cy.get('button').contains('Nuevo').click();
    cy.get('[formControlName="email"]').type('franco.colapinto@gmail.com');
    cy.get('[formControlName="password"]').type('franco1234');
    cy.get('mat-select[formControlName="role"]').click();
    cy.get('mat-option[value="client"]').click();    
    cy.get('mat-slide-toggle[formControlName="verified"]').click();
    
    cy.get('mat-select[formControlName="documentType"]').click({ force: true });
    cy.get('mat-option[value="DNI"]').click();
    cy.get('[formControlName="documentID"]').type('45637980', { force: true });
    cy.get('[formControlName="userName"]').type('Franco');
    cy.get('[formControlName="userSurname"]').type('Colapinto');
    cy.get('[formControlName="birthDate"]').type('2003-05-27');
    cy.get('[formControlName="address"]').type('Paraguay 725');
    cy.get('[formControlName="phoneNumber"]').type('3413465328');
    cy.get('[formControlName="nationality"]').type('Argentino');
    cy.get('[formControlName="phoneNumber"]').focus();

    cy.get('button[type="submit"]').click();
    

    // Navegar hasta la pagina de marcas
    cy.wait(1000);
    cy.contains('Marcas').click();

    // Crear nueva marca
    cy.wait(1000);
    cy.get('button').contains('Nueva').click();
    cy.get('[formControlName="brandName"]').type('Alpine');
    cy.contains('Nueva marca').click()

    cy.get('button[type="submit"]').click();
    
    // Navegar hasta la pagina de marcas
    cy.wait(1000);
    cy.contains('Categorías').click();

    // Crear nueva categoría
    cy.wait(1000);
    cy.get('button').contains('Nueva').click();
    cy.get('[formControlName="categoryName"]').type('Auto Formula Uno');
    cy.get('[formControlName="categoryDescription"]').type('Para ir a toda velocidad');
    cy.get('[formControlName="pricePerDay"]').type('5000');
    cy.get('[formControlName="depositValue"]').type('10000');
    cy.get('[formControlName="pricePerDay"]').focus();

    cy.get('button[type="submit"]').click();

    // Navegar hasta la pagina de colores
    cy.wait(1000);
    cy.contains('Colores').click();

    // Crear nuevo color
    cy.wait(1000);
    cy.get('button').contains('Nuevo').click();
    cy.get('[formControlName="colorName"]').type('Rosa');
    cy.contains('Nuevo color').click()

    cy.get('button[type="submit"]').click();

    // Navegar hasta la pagina de sucursales
    cy.wait(1000);
    cy.contains('Sucursales').click();

    // Crear nueva sucursal
    cy.wait(1000);
    cy.get('button').contains('Nueva').click();
    cy.get('[formControlName="locationName"]').type('Barrio Martin');
    cy.get('[formControlName="address"]').type('1ero de Mayo 1183');
    cy.get('[formControlName="phoneNumber"]').type('3413145635');
    cy.get('[formControlName="address"]').focus();

    cy.get('button[type="submit"]').click();
    
    // Navegar hasta la pagina de modelos
    cy.wait(1000);
    cy.contains('Modelos').click();

    // Crear nuevo modelo
    cy.wait(1000);
    cy.get('button').contains('Nuevo').click();
    cy.get('[formControlName="vehicleModelName"]').type('F1 Alp');
    cy.get('mat-select[formControlName="transmissionType"]').click({ force: true });
    cy.get('mat-option[value="Manual"]').click();
    cy.get('[formControlName="passengerCount"]').type('2', { force: true });
    cy.get('mat-select[formControlName="brand"]').click();
    cy.contains('mat-option', 'Alpine').click();
    cy.get('mat-select[formControlName="category"]').click();
    cy.contains('mat-option', 'Auto Formula Uno').click();
    cy.get('input[type=file]').selectFile('cypress/assets/alpine-a522-1.jpg');
    cy.get('[formControlName="passengerCount"]').focus();
    

    cy.get('button[type="submit"]').click();
    
    // Navegar hasta la pagina de vehículos
    cy.wait(1000);
    cy.contains('Vehículos').click();

    // Crear nuevo vehículo
    cy.wait(1000);
    cy.get('button').contains('Nuevo').click();
    cy.get('[formControlName="licensePlate"]').type('ALP225');
    cy.get('[formControlName="manufacturingYear"]').type('2025', { force: true });
    cy.get('[formControlName="totalKms"]').type('1000');
    cy.get('mat-select[formControlName="vehicleModel"]').click();
    cy.contains('mat-option', 'F1 Alp').click();
    cy.get('mat-select[formControlName="color"]').click();
    cy.contains('mat-option', 'Rosa').click();
    cy.get('mat-select[formControlName="location"]').click();
    cy.contains('mat-option', 'Barrio Martin').click();

    cy.get('button[type="submit"]').click();

    // Navegar hasta la pagina de reservas
    cy.wait(1000);
    cy.contains('Reservas').click();
    // Crear nueva reserva
    cy.wait(1000);
    cy.get('button').contains('Nueva').click();
    cy.get('mat-select[formControlName="documentType"]').click();
    cy.contains('mat-option', 'DNI').click();
    cy.get('mat-select[formControlName="documentID"]').click();
    cy.contains('mat-option', '45637980').click();
    cy.get('button[matStepperNext]').first().click();
    
    cy.wait(1000);
    cy.get('mat-datepicker-toggle').click();
    cy.wrap(new Date()).then((today) => {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
    
      const todayDate = today.getDate();
      const tomorrowDate = tomorrow.getDate();
    
      // Verificar si el día siguiente es el primero del siguiente mes
      const nextMonth = tomorrow.getMonth();
      const nextMonthYear = tomorrow.getFullYear();
      const firstDayOfNextMonth = new Date(nextMonthYear, nextMonth, 1).getDate();
    
      
      // Seleccionar el día de hoy
      cy.get('.mat-calendar-body-cell-content')
      .contains(todayDate.toString())
      .click();
      
      // Si mañana es el primer día del siguiente mes, mueve al siguiente mes
      if (tomorrowDate === 1) {
        // Hacer clic en la flecha para ir al siguiente mes
        cy.get('.mat-calendar-next-button').click();
      }
      // Seleccionar el día siguiente o el primer día del siguiente mes
      cy.get('.mat-calendar-body-cell-content')
        .contains(tomorrowDate === 1 ? firstDayOfNextMonth.toString() : tomorrowDate.toString())
        .click();
    });
    cy.get('mat-select[formControlName="location"]').click();
    cy.contains('mat-option', 'Barrio Martin').click();
    cy.get('button[matStepperNext]').eq(1).click();
    
    cy.wait(1000);
    cy.get('app-vehicle-card').first().trigger('mouseover');
    cy.wait(2000);
    cy.get('app-vehicle-card').first().click();
    
    cy.wait(3000)
    cy.contains('button', 'Finalizar Reserva').click();
    cy.contains('Aceptar').click();
    
    // Filtrar la reserva y hacer check-in
    cy.get('input[name="filterPost"]').type('45637980');
    cy.get('#check-in').should('not.be.disabled');
    cy.get('#check-out').should('be.disabled');
    cy.get('#cancel').should('be.disabled');
    cy.get('#delete').should('be.disabled');
    cy.get('#check-in').click();
    cy.contains('Confirmar').click();
    cy.get('#check-in').should('be.disabled');
    cy.get('#check-out').should('not.be.disabled');
    cy.get('#cancel').should('be.disabled');
    cy.get('#delete').should('be.disabled');
    
    
    // Hacer check-out
    cy.get('#check-out').click();
    cy.get('[formControlName="finalKms"]').clear().type('1500');
    cy.contains('Check-out Reserva').click();
    cy.get('button[type="submit"]').click();
    cy.get('#check-in').should('be.disabled');
    cy.get('#check-out').should('be.disabled');
    cy.get('#cancel').should('be.disabled');
    cy.get('#delete').should('be.disabled');
    
    // Cerrar sesión
    cy.contains('Cerrar Sesión').click();
    cy.contains('Aceptar').click();
    
    // Login como cliente
    cy.contains('Iniciar sesión').click();
    cy.get('[formControlName="email"]').type('franco.colapinto@gmail.com');
    cy.get('[formControlName="password"]').type('franco1234');
    cy.get('[formControlName="email"]').focus();
    cy.get('button[type="submit"]').click();
    cy.contains('Aceptar').click();
    
    // Navegar a pagina de reserva
    cy.contains('Reservar').click();

    // Realizar reserva
    cy.wait(1000);
    cy.get('mat-datepicker-toggle').click();
    cy.wrap(new Date()).then((today) => {
      // Calcular fecha inicio dentro de un mes
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() + 1);
    
      // Calcular fecha fin dentro de un mes y un día
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
    
      // Obtener el último día del mes de startDate
      const lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

      // Mover al próximo mes
      cy.get('.mat-calendar-next-button').click();

    
      // Seleccionar el día de startDate en el calendario
      cy.get('.mat-calendar-body-cell-content')
        .contains(startDate.getDate().toString())
        .click();
    
      // Si startDate es el último día del mes, mover al próximo mes
      if (startDate.getDate() === lastDayOfMonth) {
        cy.get('.mat-calendar-next-button').click();
      }
    
      // Seleccionar el día de endDate en el calendario
      cy.get('.mat-calendar-body-cell-content')
        .contains(endDate.getDate().toString())
        .click();
    });
    
    cy.get('mat-select[formControlName="location"]').click({ force: true });
    cy.contains('mat-option', 'Barrio Martin').click();
    cy.get('button[matStepperNext]').first().click();
    
    cy.wait(1000);
    cy.get('app-vehicle-card').first().trigger('mouseover');
    cy.wait(2000);
    cy.get('app-vehicle-card').first().click();
    
    cy.wait(3000)
    cy.contains('button', 'Finalizar Reserva').click();
    cy.contains('Aceptar').click();

    // Navegar a Mis Reservas
    cy.wait(1000);
    cy.contains('Mis reservas').click();
    cy.wait(4000);
    
    // Cerrar sesión
    cy.contains('Cerrar Sesión').click();
    cy.contains('Aceptar').click();
  });
});
