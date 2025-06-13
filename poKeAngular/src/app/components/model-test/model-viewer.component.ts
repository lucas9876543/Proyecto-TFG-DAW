import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  imports: [],
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModelViewerComponent {
  @Input() modelSrc: string = '';
}
