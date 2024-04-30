import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ComboboxComponent } from './combobox.component'

export type Country = {
  id: string
  value: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComboboxComponent],
  template: `
    <main class="p-10">
      <form class="flex space-x-4" (ngSubmit)="onSubmit($event)">
        <combobox-component (onResultChange)="onResultChange($event)" />

        <button
          class="h-10 bg-gray-300 px-4"
          [disabled]="result() === undefined"
          (click)="onFilter($event)"
        >
          Filter
        </button>
      </form>

      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  result = signal<Country | undefined>(undefined)

  onResultChange(country: Country | undefined) {
    this.result.set(country)
  }

  onFilter(event: Event) {
    event.preventDefault()

    console.log(this.result())
  }

  onSubmit(event: Event) {
    //
  }
}
