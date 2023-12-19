import { Component, EventEmitter, Output } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-geo-file-upload',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    MatInputModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Output()
  geoJsonParsed = new EventEmitter<any>();
  fileName = '';
  requiredFileType = '.geojson';

  // parse uploaded json file
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();

      reader.onload = (event: any) => {
        try {
          const json = JSON.parse(event.target.result);
          this.geoJsonParsed.emit(json);
        } catch (error) {
          console.error('Error parsing GeoJSON:', error);
        }
      };

      reader.readAsText(file);
    }
  }
}
