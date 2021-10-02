// recibimos llamadas de A y C
interface Input {
	precioEnvio: number,
	precioProducto: number,
	zona: number,
	tipoPago: string, // visa - mastercard
	cupon?: string,
}

interface Output {
	tieneDescuento: boolean,
	descuentoEnvio?: number, // porcentaje de descuento
	descuentoProducto?: number, // porcentaje de descuento
	cantidadEnvio?: number, // cantidad a descontar sobre el total?
	cantidadProducto?: number, // cantidad a descontar sobre el total?
	nuevoTotal: number,
}