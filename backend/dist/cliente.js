import crypto from 'node:crypto';
export class Cliente {
    constructor(tipoDoc, nroDoc, nombre, apellido, fechaNacimiento, mail, domicilio, telefonos, nacionalidad, id = crypto.randomUUID()) {
        this.tipoDoc = tipoDoc;
        this.nroDoc = nroDoc;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.mail = mail;
        this.domicilio = domicilio;
        this.telefonos = telefonos;
        this.nacionalidad = nacionalidad;
        this.id = id;
    }
}
//# sourceMappingURL=cliente.js.map