import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PersonVegetal } from '@/types/person-vegetal';
import { PlantVegetal } from '@/types/plant-vegetal';
import { Vegetal } from '@/types/vegetal';

@Component({
  imports: [RouterLink],
  selector: 'app-vegetal-table',
  styleUrl: './vegetal-table.css',
  templateUrl: './vegetal-table.html',
})
export class VegetalTable implements OnChanges {
  @Input() records: Vegetal[] = [];
  @Output() remove = new EventEmitter<Vegetal>();

  currentPage = 1;
  readonly pageSize = 8;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['records']) {
      this.currentPage = Math.min(this.currentPage, this.totalPages);
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.records.length / this.pageSize));
  }

  get pageRecords(): Vegetal[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.records.slice(start, start + this.pageSize);
  }

  get firstVisibleRecord(): number {
    return this.records.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get lastVisibleRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.records.length);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  isPlant(record: Vegetal): record is PlantVegetal {
    return record.tipoRegistro === 'planta';
  }

  getName(record: Vegetal): string {
    return this.isPlant(record) ? record.nombre : `${record.nombre} ${record.apellidos}`.trim();
  }

  getDescription(record: Vegetal): string {
    return this.isPlant(record) ? record.especie : record.causa;
  }

  getDate(record: Vegetal): string {
    return this.isPlant(record) ? record.fechaSiembra : record.fechaInicio;
  }
}
