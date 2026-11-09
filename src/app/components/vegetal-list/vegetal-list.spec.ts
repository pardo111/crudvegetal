import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VegetalService } from '@/services/vegetal';
import { VegetalList } from './vegetal-list';

describe('VegetalList', () => {
  it('renders records returned by the service on the dashboard', async () => {
    const records = [
      {
        id: 'plant-1',
        tipoRegistro: 'planta' as const,
        nombre: 'Albahaca',
        tipo: 'Medicinal' as const,
        especie: 'Ocimum basilicum',
        fechaSiembra: '2026-01-01',
        estado: 'En crecimiento' as const,
        observaciones: '',
      },
      {
        id: 'person-1',
        tipoRegistro: 'persona' as const,
        nombre: 'Ana',
        apellidos: 'Pérez',
        fechaInicio: '2026-01-02',
        causa: 'Dato de prueba',
        gravedad: 'Moderada' as const,
        observaciones: '',
      },
    ];

    await TestBed.configureTestingModule({
      imports: [VegetalList],
      providers: [
        provideRouter([]),
        { provide: VegetalService, useValue: { list: async () => records, delete: async () => undefined } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(VegetalList);
    fixture.detectChanges();
    await fixture.componentInstance.loadRecords();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(page.textContent).toContain('Albahaca');
    expect(page.textContent).toContain('Ana Pérez');
    expect(page.textContent).not.toContain('Aún no hay registros');
  });
});
