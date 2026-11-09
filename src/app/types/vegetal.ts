import { PersonVegetal } from './person-vegetal';
import { PlantVegetal } from './plant-vegetal';

export type Vegetal = PlantVegetal | PersonVegetal;
export type VegetalData = Omit<PlantVegetal, 'id'> | Omit<PersonVegetal, 'id'>;
