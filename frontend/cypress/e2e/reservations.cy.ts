//Dejar abierto el cypress.config.ts para que no de error

describe('Reservas - Test de Check-in', () => {
  it('Debería permitir hacer check-in de una reserva', () => {
    cy.visit('http://localhost:4200/login'); // URL de tu frontend

    // Simular login si es necesario
    cy.get('[formControlName="email"]').type('admin@admin.com');
    cy.get('[formControlName="password"]').type('admin');
    cy.get('[formControlName="email"]').focus();
    cy.get('button[type="submit"]').click();
    cy.contains('Aceptar').click();

    // Navegar hasta la página de reservas
    cy.get('[routerLink="/staff/reservations"]').click();

    // Filtrar la reserva y hacer check-in
    cy.get('input[name="filterPost"]').type('45638484'); // documento del cliente (poner uno que exista y cuya primer reserva pueda hacer check in)

    // Espera que el botón de check-in esté habilitado
    cy.get('#check-in').should('not.be.disabled');


    // Haz clic en el botón de check-in
    cy.get('#check-in').click();

    // Haz click en confirmar
    cy.contains('Confirmar').click();
      

    // Espera que el botoón del Check-In se haya deshabilitado
    cy.get('#check-in').should('be.disabled');
  });
});
