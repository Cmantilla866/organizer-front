import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DarkModeService } from 'src/app/service/dark-mode.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  darkMode: boolean = true;
  subscription: Subscription;

  constructor(private overlay: OverlayContainer, private darkModeService: DarkModeService) {
    if (this.darkMode){
      this.overlay.getContainerElement().classList.add('darkMode');
    }
    else{
      this.overlay.getContainerElement().classList.remove('darkMode');
    }
    this.subscription = this.darkModeService.onToggle().subscribe((value) => {
      this.darkMode = value;
      if (this.darkMode){
        this.overlay.getContainerElement().classList.add('darkMode');
      }
      else{
        this.overlay.getContainerElement().classList.remove('darkMode');
      }
    });
  }

  getBodyClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
