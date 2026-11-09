import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  deleteField,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { firebaseApp } from '../../../enviroments/environment';
import { PersonVegetal } from '@/types/person-vegetal';
import { PlantVegetal } from '@/types/plant-vegetal';
import { Vegetal, VegetalData } from '@/types/vegetal';

const COLLECTION_NAME = 'vegetales';

@Injectable({ providedIn: 'root' })
export class VegetalService {
  private readonly firestore = getFirestore(firebaseApp);
  private readonly records = collection(
    this.firestore,
    COLLECTION_NAME,
  ) as CollectionReference<DocumentData>;

  async list(): Promise<Vegetal[]> {
    const snapshot = await getDocs(this.records);
    return snapshot.docs.map((record) => this.parseRecord(record.id, record.data()));
  }

  async get(id: string): Promise<Vegetal | null> {
    const snapshot = await getDoc(doc(this.firestore, COLLECTION_NAME, id));
    return snapshot.exists() ? this.parseRecord(snapshot.id, snapshot.data()) : null;
  }

  async create(record: VegetalData): Promise<string> {
    const result = await addDoc(this.records, record);
    return result.id;
  }

  async update(id: string, record: VegetalData): Promise<void> {
    const updateData = record.tipoRegistro === 'persona'
      ? { ...record, identificador: deleteField() }
      : { ...record, color: deleteField() };
    await updateDoc(doc(this.firestore, COLLECTION_NAME, id), updateData);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, COLLECTION_NAME, id));
  }

  private parseRecord(id: string, data: DocumentData): Vegetal {
    if (data['tipoRegistro'] === 'planta' && this.hasPlantFields(data)) {
      const { color: _legacyColor, ...plantData } = data;
      return {
        ...plantData,
        id,
        observaciones: this.getObservations(data),
      } as PlantVegetal;
    }

    if (data['tipoRegistro'] === 'persona' && this.hasPersonFields(data)) {
      const { identificador: _legacyIdentifier, ...personData } = data;
      return {
        ...personData,
        id,
        nombre: typeof data['nombre'] === 'string' ? data['nombre'] : 'Persona',
        apellidos: typeof data['apellidos'] === 'string' ? data['apellidos'] : '',
        observaciones: this.getObservations(data),
      } as PersonVegetal;
    }

    throw new Error(`El registro ${id} no tiene un formato de vegetal válido.`);
  }

  private hasPlantFields(data: DocumentData): boolean {
    return ['nombre', 'tipo', 'especie', 'fechaSiembra', 'estado']
      .every((field) => typeof data[field] === 'string');
  }

  private hasPersonFields(data: DocumentData): boolean {
    const hasSharedFields = ['fechaInicio', 'causa', 'gravedad']
      .every((field) => typeof data[field] === 'string');
    const hasName = typeof data['nombre'] === 'string' && typeof data['apellidos'] === 'string';
    const isLegacyRecord = typeof data['identificador'] === 'string';

    return hasSharedFields && (hasName || isLegacyRecord);
  }

  private getObservations(data: DocumentData): string {
    return typeof data['observaciones'] === 'string' ? data['observaciones'] : '';
  }
}
