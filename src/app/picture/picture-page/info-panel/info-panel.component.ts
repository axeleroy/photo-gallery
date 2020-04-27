import { Component, Input } from '@angular/core';
import { ExifTag } from "../../../shared/types/ExifTag";
import { ExifMap } from "../../../shared/types/Picture";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: [ './info-panel.component.css' ]
})
export class InfoPanelComponent {
  ExifTag = ExifTag;

  @Input()
  exifTags: ExifMap;

}
