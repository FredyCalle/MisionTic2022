import {injectable, /* inject, */ BindingScope} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Servicio de mensajeria Twilio
   */

  EnviarNotificacionesPorSMS(SMS:string,Telefono:string):void{
    console.log('probando envio mensajeria por Twilio');
    const accountSid = 'ACf3cf2705b9f672c67500e993f78b735d'; // Your Account SID from www.twilio.com/console
    const authToken = '061852acabe5b99701fb7ddaa090cdf7'; // Your Auth Token from www.twilio.com/console //siempre verificar y modificar el Token
    
    const twilio = require('twilio');
    const client = new twilio(accountSid, authToken);
    
    client.messages
      .create({
        body: SMS,
        to: '+57'+ Telefono, // Text this number
        from: '+14092079688' // From a valid Twilio number
      })
      .then((message:any) => console.log(message.sid));    
  }
}

