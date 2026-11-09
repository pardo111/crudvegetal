export type Severity = 'Leve' | 'Moderada' | 'Grave' | 'Crítica';

export interface PersonVegetal {
  id?: string;
  tipoRegistro: 'persona';
  nombre: string;
  apellidos: string;
  fechaInicio: string;
  causa: string;
  gravedad: Severity;
  observaciones: string;
}
