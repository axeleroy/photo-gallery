import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PictureWrapper} from '../../types/PictureWrapper';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.css']
})
export class PicturePageComponent implements OnInit, OnDestroy {
  private pictureWrapper: PictureWrapper;
  private subscription: Subscription;
  showInfoPanel = false;

  @ViewChild('pictureComponent', { static: false })
  pictureComponent: ElementRef;

  constructor(private route: ActivatedRoute) {
    this.subscription = this.route.data.subscribe((data) => this.pictureWrapper = data.picture);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleInfoPanel() {
    this.showInfoPanel = !this.showInfoPanel;
  }

}
