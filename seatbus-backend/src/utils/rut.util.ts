export const validarRutChileno = (rut: string): boolean => {
  if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
  
  const [numero, dv] = rut.split('-');
  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dvCalculado.toUpperCase() === dv.toUpperCase();
};