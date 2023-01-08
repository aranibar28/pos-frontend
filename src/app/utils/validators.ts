import { FormGroup, FormControl } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function getErrorMessage(name: string, myForm: FormGroup) {
  const control = myForm.controls[name];
   
  if (control.hasError('required')) {
    return 'Este campo es obligatorio';
  } else if (control.hasError('email')) {
    return 'Dirección de correo electrónico no válida';
  } else if (control.hasError('minlength')) {
    return `La longitud mínima es ${control.getError('minlength')['requiredLength']} caracteres.`;
  } else if (control.hasError('maxlength')) {
    return `La longitud máxima es ${control.getError('maxlength')['requiredLength']} caracteres.`;
  } else if (control.getError('pattern')['requiredPattern'] == '/^[0-9]+(\\.[0-9]+)?$/') {
    return `El formato debe ser númerico y con un valor positivo.`;
  } else if (control.getError('pattern')['requiredPattern'] == '/^[0-9]{8}$/') {
    return `El formato debe ser DNI válido de 8 dígitos.`;
  } else if (control.getError('pattern')['requiredPattern'] == '/^[0-9]{11}$/') {
    return `El formato debe ser RUC válido de 11 dígitos.`;
  } else if (control.getError('pattern')['requiredPattern'] == '/^9[0-9]{9}$/') {
    return `El formato debe ser un celular válido de 9 dígitos.`;
  } else {
    return '';
  }
}

export function getErrorUnitControl(control: FormControl){
  if (control.hasError('required')) {
    return 'Este campo es obligatorio';
  } else if (control.hasError('minlength')) {
    return `La longitud mínima es ${control.getError('minlength')['requiredLength']} caracteres.`;
  } else if (control.hasError('maxlength')) {
    return `La longitud máxima es ${control.getError('maxlength')['requiredLength']} caracteres.`;
  } else if (control.getError('pattern')['requiredPattern'] == '^F[A-Za-z0-9]{3}$') {
    return `El formato debe tener 4 caracteres alfanuméricos y empezar con 'F'.`;
  } else if (control.getError('pattern')['requiredPattern'] == '^B[A-Za-z0-9]{3}$') {
    return `El formato debe tener 4 caracteres alfanuméricos y empezar con 'B'.`;
  } else {
    return '';
  }
}

export function longitudMaximaValidator(longitudMaxima: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.value && control.value.toString().length > longitudMaxima) {
      return {'longitudMaxima': {value: control.value}};
    }
    return null;
  };
}