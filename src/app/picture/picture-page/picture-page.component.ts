import {Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PictureWrapper} from '../../shared/types/PictureWrapper';
import {Subscription} from 'rxjs';
import { InfoPanelComponent } from "./info-panel/info-panel.component";

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.css']
})
export class PicturePageComponent implements OnDestroy {
  private subscription: Subscription;
  pictureWrapper: PictureWrapper;
  showInfoPanel = false;

  @ViewChild('pictureComponent')
  pictureComponent: ElementRef;
  @ViewChild('infoPanelComponent')
  infoPanelComponent: InfoPanelComponent

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.subscription = this.route.data.subscribe((data) => this.pictureWrapper = data.picture);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleInfoPanel() {
    this.showInfoPanel = !this.showInfoPanel;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "ArrowLeft" && this.pictureWrapper.previousPictureId) {
        this.router.navigate(['..', this.pictureWrapper.previousPictureId], { relativeTo: this.route });
    }
    if (event.key === "ArrowRight" && this.pictureWrapper.nextPictureId) {
      this.router.navigate(['..', this.pictureWrapper.nextPictureId], { relativeTo: this.route });
    }
    if (event.key === "Escape") {
      // Navigate back to album page
      this.router.navigate(['../..'], { relativeTo: this.route });
    }
    if (event.key === "i") {
      this.toggleInfoPanel();
    }
  }

}
