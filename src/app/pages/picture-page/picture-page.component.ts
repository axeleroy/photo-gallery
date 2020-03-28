import {Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PictureWrapper} from '../../types/PictureWrapper';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.css']
})
export class PicturePageComponent implements OnDestroy {
  private subscription: Subscription;
  pictureWrapper: PictureWrapper;
  loading = true;
  showInfoPanel = false;

  @ViewChild('pictureComponent', { static: false })
  pictureComponent: ElementRef;

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

  loadingStateChange(loading: boolean) {
    this.loading = loading;
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
