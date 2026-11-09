import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PersonVegetal } from '@/types/person-vegetal';
import { PlantVegetal } from '@/types/plant-vegetal';
import { Vegetal } from '@/types/vegetal';
import { VegetalService } from '@/services/vegetal';

@Component({
  imports: [RouterLink],
  selector: 'app-vegetal-detail',
  styleUrl: './vegetal-detail.css',
  templateUrl: './vegetal-detail.html',
})
export class VegetalDetail implements OnInit {
  @Input() id: string | undefined = undefined;

  record: Vegetal | null = null;
  loading = true;
  error = '';

  constructor(
    private readonly vegetalService: VegetalService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.id) {
      this.error = 'No se proporcionó un identificador de registro.';
      this.loading = false;
      return;
    }

    try {
      this.record = await this.vegetalService.get(this.id);
      if (!this.record) {
        this.error = 'No se encontró el registro solicitado.';
      }
    } catch (error) {
      console.error('No se pudo cargar el detalle del registro.', error);
      this.error = 'No se pudo cargar el registro. Revisa la conexión y los permisos de Firestore.';
    } finally {
      this.loading = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  isPlant(record: Vegetal): record is PlantVegetal {
    return record.tipoRegistro === 'planta';
  }

  getTitle(record: Vegetal): string {
    return this.isPlant(record) ? record.nombre : `${record.nombre} ${record.apellidos}`.trim();
  }

  getDate(record: Vegetal): string {
    return this.isPlant(record) ? record.fechaSiembra : record.fechaInicio;
  }
}
