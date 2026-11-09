import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Severity } from '@/types/person-vegetal';
import { PlantStatus, PlantType } from '@/types/plant-vegetal';
import { Vegetal, VegetalData } from '@/types/vegetal';
import { VegetalService } from '@/services/vegetal';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-vegetal-form',
  styleUrl: './vegetal-form.css',
  templateUrl: './vegetal-form.html',
})
export class VegetalForm implements OnChanges {
  @Input() id: string | undefined = undefined;
  private readonly formBuilder = inject(FormBuilder);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private loadSequence = 0;

  readonly form = this.formBuilder.nonNullable.group({
    nombre: [''],
    tipo: ['Hortaliza' as PlantType],
    especie: [''],
    fechaSiembra: [''],
    estado: ['Sembrado' as PlantStatus],
    personaNombre: [''],
    apellidos: [''],
    fechaInicio: [''],
    causa: [''],
    gravedad: ['Moderada' as Severity],
    observaciones: [''],
  });

  selectedType: 'planta' | 'persona' = 'planta';
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private readonly vegetalService: VegetalService,
    private readonly router: Router,
  ) {
    this.updateRequiredFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      void this.loadRecord();
    }
  }

  private async loadRecord(): Promise<void> {
    const requestedId = this.id;
    const sequence = ++this.loadSequence;
    this.error = '';
    if (!requestedId) {
      this.loading = false;
      return;
    }
    this.loading = true;
    try {
      const record = await this.vegetalService.get(requestedId);
      if (sequence !== this.loadSequence) {
        return;
      }
      if (!record) {
        this.error = 'No se encontró el registro solicitado.';
        return;
      }
      this.populateForm(record);
    } catch (error) {
      if (sequence !== this.loadSequence) {
        return;
      }
      console.error('No se pudo cargar el registro para editar.', error);
      this.error = 'No se pudo cargar el registro. Revisa la conexión y los permisos de Firestore.';
    } finally {
      if (sequence === this.loadSequence) {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  selectType(type: 'planta' | 'persona'): void {
    this.selectedType = type;
    this.updateRequiredFields();
  }

  async save(): Promise<void> {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const values = this.form.getRawValue();
    const record: VegetalData = this.selectedType === 'planta'
      ? {
          tipoRegistro: 'planta',
          nombre: values.nombre.trim(),
          tipo: values.tipo,
          especie: values.especie.trim(),
          fechaSiembra: values.fechaSiembra,
          estado: values.estado,
          observaciones: values.observaciones.trim(),
        }
      : {
          tipoRegistro: 'persona',
          nombre: values.personaNombre.trim(),
          apellidos: values.apellidos.trim(),
          fechaInicio: values.fechaInicio,
          causa: values.causa.trim(),
          gravedad: values.gravedad,
          observaciones: values.observaciones.trim(),
        };

    try {
      if (this.id) {
        await this.vegetalService.update(this.id, record);
      } else {
        await this.vegetalService.create(record);
      }
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('No se pudo guardar el registro.', error);
      this.error = 'No se pudo guardar. Comprueba las reglas de Firestore e inténtalo de nuevo.';
    } finally {
      this.submitting = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  private populateForm(record: Vegetal): void {
    this.selectType(record.tipoRegistro);
    if (record.tipoRegistro === 'planta') {
      this.form.patchValue(record);
    } else {
      this.form.patchValue({
        personaNombre: record.nombre,
        apellidos: record.apellidos,
        fechaInicio: record.fechaInicio,
        causa: record.causa,
        gravedad: record.gravedad,
        observaciones: record.observaciones,
      });
    }
  }

  private updateRequiredFields(): void {
    const requiredFields = this.selectedType === 'planta'
      ? ['nombre', 'tipo', 'especie', 'fechaSiembra', 'estado']
      : ['personaNombre', 'apellidos', 'fechaInicio', 'causa', 'gravedad'];

    for (const [name, control] of Object.entries(this.form.controls)) {
      control.setValidators(
        requiredFields.includes(name)
          ? [Validators.required, Validators.pattern(/\S/)]
          : [],
      );
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
}
