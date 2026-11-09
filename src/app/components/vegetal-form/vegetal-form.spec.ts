import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { VegetalService } from '@/services/vegetal';
import { PersonVegetal } from '@/types/person-vegetal';
import { PlantVegetal } from '@/types/plant-vegetal';
import { VegetalForm } from './vegetal-form';

describe('VegetalForm', () => {
  const firstPlant: PlantVegetal = {
    id: 'plant-1',
    tipoRegistro: 'planta',
    nombre: 'Albahaca',
    tipo: 'Medicinal',
    especie: 'Ocimum basilicum',
    fechaSiembra: '2026-01-01',
    estado: 'En crecimiento',
    observaciones: '',
  };
  const secondPlant: PlantVegetal = { ...firstPlant, id: 'plant-2', nombre: 'Romero' };
  const person: PersonVegetal = {
    id: 'person-1',
    tipoRegistro: 'persona',
    nombre: 'Ana',
    apellidos: 'Pérez',
    fechaInicio: '2026-02-01',
    causa: 'Causa de prueba',
    gravedad: 'Moderada',
    observaciones: '',
  };
  let fixture: ComponentFixture<VegetalForm>;
  let service: { get: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    service = {
      get: vi.fn(async (id: string) => {
        if (id === 'plant-1') return firstPlant;
        if (id === 'person-1') return person;
        return secondPlant;
      }),
    };
    await TestBed.configureTestingModule({
      imports: [VegetalForm],
      providers: [
        provideRouter([]),
        { provide: VegetalService, useValue: service },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(VegetalForm);
  });

  it('requires meaningful values for the active plant fields', () => {
    const component = fixture.componentInstance;
    expect(component.form.invalid).toBe(true);
    expect('color' in component.form.controls).toBe(false);

    component.form.patchValue({
      nombre: '   ',
      especie: 'Albahaca',
      fechaSiembra: '2026-01-01',
    });

    expect(component.form.controls.nombre.invalid).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('renders plant categories as a select control', () => {
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select[formControlName="tipo"]',
    ) as HTMLSelectElement | null;
    expect(select).not.toBeNull();
    expect(Array.from(select!.options).map((option) => option.value)).toEqual([
      'Hortaliza',
      'Frutal',
      'Ornamental',
      'Medicinal',
      'Otro',
    ]);
  });

  it('switches required fields between plants and people', () => {
    const component = fixture.componentInstance;
    component.selectType('persona');
    component.form.patchValue({
      personaNombre: 'Ana',
      apellidos: 'Pérez',
      fechaInicio: '2026-01-01',
      causa: 'Causa de prueba',
    });

    expect(component.form.controls.personaNombre.valid).toBe(true);
    expect(component.form.controls.apellidos.valid).toBe(true);
    expect(component.form.controls.nombre.valid).toBe(true);
    expect(component.form.invalid).toBe(false);
  });

  it('requires both a person name and surname', () => {
    const component = fixture.componentInstance;
    component.selectType('persona');
    component.form.patchValue({
      personaNombre: 'Ana',
      fechaInicio: '2026-01-01',
      causa: 'Causa de prueba',
    });

    expect(component.form.controls.personaNombre.valid).toBe(true);
    expect(component.form.controls.apellidos.invalid).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('loads names into the correct fields when editing a person', async () => {
    fixture.componentRef.setInput('id', 'person-1');
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.selectedType).toBe('persona');
    expect(fixture.componentInstance.form.controls.personaNombre.value).toBe('Ana');
    expect(fixture.componentInstance.form.controls.apellidos.value).toBe('Pérez');
  });

  it('reloads the record when the route id changes on the same form instance', async () => {
    fixture.componentRef.setInput('id', 'plant-1');
    fixture.detectChanges();
    await Promise.resolve();
    expect(fixture.componentInstance.form.controls.nombre.value).toBe('Albahaca');

    fixture.componentRef.setInput('id', 'plant-2');
    fixture.detectChanges();
    await Promise.resolve();
    expect(fixture.componentInstance.form.controls.nombre.value).toBe('Romero');
    expect(service.get).toHaveBeenCalledTimes(2);
  });
});
