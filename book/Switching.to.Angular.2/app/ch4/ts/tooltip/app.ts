import {HostListener, provide, Input, Injectable, ElementRef, Inject, Directive, Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

class Overlay {
  private el: HTMLElement;
  constructor() {
    var el = document.createElement('div');
    el.className = 'tooltip';
    this.el = el;
  }
  close() {
    this.el.hidden = true;
  }
  open(el, text) {
    this.el.innerHTML = text;
    this.el.hidden = false;
    var rect = el.nativeElement.getBoundingClientRect();
    this.el.style.left = rect.left + 'px';
    this.el.style.top = rect.top + 'px';
  }
  attach(target) {
    target.appendChild(this.el);
  }
  detach() {
    this.el.parentNode.removeChild(this.el);
  }
}

class OverlayMock {
  constructor() {}
  close() {}
  open(el, text) {}
  attach(target) {}
  detach() {}
}

@Directive({
  selector: '[saTooltip]'
})
export class Tooltip {
  @Input()
  saTooltip:string;

  constructor(private el: ElementRef, private overlay: Overlay) {
    this.overlay.attach(el.nativeElement);
  }
  @HostListener('mouseenter')
  onMouseEnter() {
    this.overlay.open(this.el, this.saTooltip);
  }
  @HostListener('mouseleave')
  onMouseLeave() {
    this.overlay.close();
  }
}

@Component({
  selector: 'app',
  templateUrl: './app.html',
  providers: [Overlay],
  directives: [Tooltip]
})
class App {}

bootstrap(App);
