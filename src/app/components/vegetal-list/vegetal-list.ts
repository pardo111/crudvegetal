import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VegetalTable } from '@/components/vegetal-table/vegetal-table';
import { Vegetal } from '@/types/vegetal';
import { VegetalService } from '@/services/vegetal';

@Component({
  imports: [RouterLink, VegetalTable],
  selector: 'app-vegetal-list',
  styleUrl: './vegetal-list.css',
  templateUrl: './vegetal-list.html',
})
export class VegetalList implements OnInit {
  records: Vegetal[] = [];
  loading = true;
  error = '';

  constructor(
    private readonly vegetalService: VegetalService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadRecords();
  }

  async loadRecords(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.records = await this.vegetalService.list();
    } catch (error) {
      console.error('No se pudieron cargar los registros de Firestore.', error);
      this.error = 'No se pudieron cargar los registros. Revisa la conexión y las reglas de Firestore.';
    } finally {
      this.loading = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  async deleteRecord(record: Vegetal): Promise<void> {
    if (!record.id || !window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) {
      return;
    }

    this.error = '';
    try {
      await this.vegetalService.delete(record.id);
      this.records = this.records.filter((item) => item.id !== record.id);
    } catch (error) {
      console.error('No se pudo eliminar el registro.', error);
      this.error = 'No se pudo eliminar el registro. Comprueba los permisos de Firestore e inténtalo de nuevo.';
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }
}
