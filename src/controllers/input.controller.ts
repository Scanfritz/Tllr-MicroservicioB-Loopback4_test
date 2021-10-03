import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, post, requestBody,
  response,
  ResponseObject
} from '@loopback/rest';
import {Input} from '../models';
import {InputRepository} from '../repositories';

const INPUT_RESPONSE: ResponseObject = {
  description: 'Input Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'InputResponse',
        properties: {
          tieneDescuento: {type: 'boolean'},
          shipmentDiscount: {type: 'number'},
          productDiscount: {type: 'number'},
          amountShipmentDiscount: {type: 'number'},
          amountProductDiscount: {type: 'number'},
        },
      },
    },
  },
};

export class InputController {
  constructor(
    @repository(InputRepository)
    public inputRepository: InputRepository,
  ) { }

  @post('/input')
  @response(200, INPUT_RESPONSE)
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Input, {
            title: 'NewInput',
            exclude: ['id'],
          }),
        },
      },
    })
    input: Omit<Input, 'id'>,
  ): Promise<object> {
    return searchDiscount(input.precioEnvio, input.precioProducto, input.zona, input.tipoPago, input.cupon)
  }
}

const searchDiscount = (sPrice: number, pPrice: number, zone: number, pType: string, coupon: string): object => {

  const dataArr = [sPrice, pPrice, zone, pType, coupon];

  const couponDB = ['*-*-1,2-paypal-*', '*-*-1,2-mastercard-MASTER20', '*-*-5-mastercard-*', '*-4000-3-*-*', '*-3000-4-mastercard-*', '*-10000-*-*-*', '*-*-1,2,3-visa,mastercard-PERRITOFELI', '*-*-4,5-*-NOJADO'];

  const discountDB = [{s: 0, p: .15}, {s: 0, p: .2}, {s: 0, p: .1}, {s: 0, p: .15}, {s: 1, p: 0}, {s: 1, p: 0}, {s: .15, p: 0}, {s: .1, p: 0}];

  let validCoupons = [];

  for (let i = 0; i < couponDB.length; i++) {
    const couponEls = couponDB[i].split('-');

    let couponConditions = [];

    for (let j = 0; j < couponEls.length; j++) {
      if (couponEls[j] == '*') {
        couponConditions.push(true);
        continue;
      }
      else if (j == 1) {
        if (pPrice > parseInt(couponEls[j])) {
          couponConditions.push(true);
          continue;
        }
        else {
          couponConditions.push(false);
        }
      }
      else {
        const couponElList = couponEls[j].split(',')

        if (couponElList.length == 1) {
          if (couponElList[0].toString() == dataArr[j].toString()) {
            couponConditions.push(true);
          }
          else {
            couponConditions.push(false);
          }
        }
        else {
          let elFlag = false;
          for (let k = 0; k < couponElList.length; k++) {
            if (couponElList[k].toString() == dataArr[j].toString()) {
              elFlag = true;
              break;
            }
            else {
              elFlag = false;
            }
          }
          couponConditions.push(elFlag);
        }
      }
    }

    // console.log(couponConditions);

    if (couponConditions.every(values => values == true)) {
      validCoupons.push(true);
    }
    else {
      validCoupons.push(false);
    }
  }

  // console.log(validCoupons);
  for (let i = 0; i < validCoupons.length; i++) {
    if (validCoupons[i] == true) {
      // console.log(couponDB[i]);
      // console.log(discountDB[i]);
      const dSend = (sPrice * discountDB[i].s);
      const dProd = (pPrice * discountDB[i].p);
      return assignToOutput(true, discountDB[i].s, discountDB[i].p, dSend, dProd, ((pPrice + sPrice) - (dSend + dProd)));
    }
  }

  return assignToOutput(false, 0, 0, 0, 0, (pPrice + sPrice));
}

const assignToOutput = (hasDiscount: Boolean, dSend: number, dProd: number, qSend: number, qProd: number, nTotal: number): object => {
  return {
    tieneDescuento: hasDiscount,
    shipmentDiscount: dSend,
    productDiscount: dProd,
    amountShipmentDiscount: qSend,
    amountProductDiscount: qProd,
    nuevoTotal: nTotal,
  }
}
