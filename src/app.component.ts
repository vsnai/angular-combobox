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
        <combobox-component (fooChange)="onFooChange($event)" />

        <button class="h-10 bg-gray-300 px-4" (click)="onFilter($event)">
          Filter
        </button>
      </form>

      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  foo = signal<Country | undefined>(undefined)

  onFooChange(country: Country | undefined) {
    this.foo.set(country)
  }

  onFilter(event: Event) {
    event.preventDefault()

    console.log(this.foo())
  }

  onSubmit(event: Event) {
    //
  }
}
