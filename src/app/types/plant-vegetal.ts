export type PlantType = 'Frutal' | 'Ornamental' | 'Medicinal' | 'Hortaliza' | 'Otro';
export type PlantStatus = 'Sembrado' | 'En crecimiento' | 'Listo para cosecha' | 'En reposo';

export interface PlantVegetal {
  id?: string;
  tipoRegistro: 'planta';
  nombre: string;
  tipo: PlantType;
  especie: string;
  fechaSiembra: string;
  estado: PlantStatus;
  observaciones: string;
}
