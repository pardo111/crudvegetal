import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Vegetal } from '@/types/vegetal';
import { VegetalTable } from './vegetal-table';

describe('VegetalTable', () => {
  it('paginates records and clamps the current page when records shrink', async () => {
    await TestBed.configureTestingModule({
      imports: [VegetalTable],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(VegetalTable);
    const records: Vegetal[] = Array.from({ length: 9 }, (_, index) => ({
      id: `plant-${index + 1}`,
      tipoRegistro: 'planta',
      nombre: `Planta ${index + 1}`,
      tipo: 'Hortaliza',
      especie: 'Prueba',
      fechaSiembra: '2026-01-01',
      estado: 'Sembrado',
      observaciones: '',
    }));

    fixture.componentRef.setInput('records', records);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.pageRecords).toHaveLength(8);
    expect(component.totalPages).toBe(2);
    component.changePage(2);
    expect(component.pageRecords[0].id).toBe('plant-9');
    component.changePage(3);
    expect(component.currentPage).toBe(2);

    fixture.componentRef.setInput('records', records.slice(0, 3));
    fixture.detectChanges();
    expect(component.currentPage).toBe(1);
    expect(component.pageRecords).toHaveLength(3);
  });
});
