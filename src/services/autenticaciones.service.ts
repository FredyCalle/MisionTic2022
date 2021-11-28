import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository/dist/decorators';
import {Llaves} from '../config/llaves';
import {Empleado} from '../models/empleado.model';
import {EmpleadoRepository} from '../repositories';
const generator = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionesService {
  constructor(
    @repository(EmpleadoRepository)
    public empleadoRepository: EmpleadoRepository
  ) { }

  /*
   * Para la autenticacion defino 2 metodos
   */
  GenerarClave() {
    let clave = generator(12, false);
    return clave;
  }

  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  //Para la autorizacion al sistema defino 3 metodos

  IdentificarPersona(empleado: string, clave: string) {
    try {
      let p = this.empleadoRepository.findOne({where: {Email: empleado, clave: clave}});
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  GenerarTokenJWT(empleado: Empleado) {
    let token = jwt.sign({
      data: {
        id: empleado.id,
        correo: empleado.Email,
        nombre: empleado.Nombres + " " + empleado.Apellidos
      }
    },
      Llaves.claveJWT);
    return token;
  }

  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
}
