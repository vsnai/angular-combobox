import { Component, ElementRef, ViewChildren, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Combobox } from './combobox'
import { gsap } from 'gsap'

export type Country = {
  id: string
  value: string
}

@Component({
  selector: 'vsn-app',
  standalone: true,
  imports: [RouterOutlet, Combobox],
  template: `
    <main class="flex flex-col space-y-4 p-10">
      <div>
        <button
          class="flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
          (click)="toggleFilter()"
        >
          Toggle
        </button>
      </div>

      @if (isOpen()) {
        <form #formRef class="flex space-x-4" (ngSubmit)="onSubmit($event)">
          <vsn-combobox (onResultChange)="onResultChange($event)" />

          <button
            class="flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-200 disabled:text-gray-500"
            [disabled]="result() === undefined"
            (click)="onFilter($event)"
          >
            Filter
          </button>
        </form>
      }

      <router-outlet />
    </main>
  `,
})
export class App {
  isOpen = signal(false)
  result = signal<Country | undefined>(undefined)

  @ViewChildren('formRef') formRef!: ElementRef

  constructor(private elementRef: ElementRef) {}

  onResultChange(country: Country | undefined) {
    this.result.set(country)
  }

  toggleFilter() {
    this.isOpen.set(!this.isOpen())

    const element = this.formRef.nativeElement

    if (this.isOpen()) {
      gsap.to(element, { duration: 0.5, opacity: 1 })
    } else {
      gsap.to(element, { duration: 0.5, opacity: 0 })
    }
  }

  onFilter(event: Event) {
    event.preventDefault()

    console.log(this.result())
  }

  onSubmit(event: Event) {
    //
  }
}
