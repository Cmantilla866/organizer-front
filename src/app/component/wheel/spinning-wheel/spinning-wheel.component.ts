import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinning-wheel',
  templateUrl: './spinning-wheel.component.html',
  styleUrls: ['./spinning-wheel.component.scss']
})
export class SpinningWheelComponent implements OnInit {

  currentRotation = 0;
  targetRotation = 0;
  isSpinning = false;
  options = [
    { label: 'Option 1', value: 1, color: 'blue' },
    { label: 'Option 2', value: 2, color: 'green' },
    { label: 'Option 3', value: 3, color: 'yellow' },
    { label: 'Option 4', value: 4, color: 'orange' },
    { label: 'Option 5', value: 5, color: 'purple' }
  ];
  
  selectedOption: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  getWheelTransform(index: number): string {
    const numOptions = this.options.length;
    const angle = 360 / numOptions;
    const rotateAngle = (index * angle) + (angle / 2);
    const transform = `rotate(${rotateAngle}deg) translate(0, -50%) rotate(-${rotateAngle}deg)`;
  
    return transform;
  }
  

  spinWheel(): void {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;
    const randomIndex = Math.floor(Math.random() * this.options.length);
    const optionAngle = 360 / this.options.length;
    const targetAngle = randomIndex * optionAngle;
    this.targetRotation = 720 + targetAngle;
    this.rotateWheel();
  }

  stopWheel(): void {
    this.isSpinning = false;
    const wheel = document.querySelector('.wheel') as HTMLElement;
    const currentRotation = this.currentRotation % 360;
    const optionAngle = 360 / this.options.length;
    let selectedIndex = Math.floor(currentRotation / optionAngle);
    if (selectedIndex < 0) {
      selectedIndex += this.options.length;
    }
  }

  rotateWheel(): void {
    if (!this.isSpinning) {
      return;
    }
    this.currentRotation += 5;
    if (this.currentRotation >= this.targetRotation) {
      this.stopWheel();
      return;
    }
    const wheel = document.querySelector('.wheel') as HTMLElement;
    wheel.style.transform = `rotate(${this.currentRotation}deg)`;
    setTimeout(() => this.rotateWheel(), 50);
  }

}
