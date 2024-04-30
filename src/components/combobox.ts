import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  computed,
  effect,
  signal,
} from '@angular/core'
import { Country } from './app'

const countries = [
  { id: 'at', value: 'Austria' },
  { id: 'be', value: 'Belgium' },
  { id: 'bg', value: 'Bulgaria Bulgaria Bulgaria Bulgaria Bulgaria' },
  { id: 'hr', value: 'Croatia' },
  { id: 'cy', value: 'Cyprus' },
  { id: 'cz', value: 'Czechia' },
  { id: 'dk', value: 'Denmark' },
  { id: 'ee', value: 'Estonia' },
  { id: 'fi', value: 'Finland' },
  { id: 'fr', value: 'France' },
  { id: 'de', value: 'Germany' },
  { id: 'el', value: 'Greece' },
  { id: 'hu', value: 'Hungary' },
  { id: 'is', value: 'Iceland' },
  { id: 'ie', value: 'Ireland' },
  { id: 'it', value: 'Italy' },
  { id: 'lv', value: 'Latvia' },
  { id: 'li', value: 'Liechtenstein' },
  { id: 'lt', value: 'Lithuania' },
  { id: 'lu', value: 'Luxembourg' },
  { id: 'mt', value: 'Malta' },
  { id: 'nl', value: 'Netherlands' },
  { id: 'no', value: 'Norway' },
  { id: 'pl', value: 'Poland' },
  { id: 'pt', value: 'Portugal' },
  { id: 'ro', value: 'Romania' },
  { id: 'sk', value: 'Slovakia' },
  { id: 'si', value: 'Slovenia' },
  { id: 'es', value: 'Spain' },
  { id: 'se', value: 'Sweden' },
  { id: 'ch', value: 'Switzerland' },
]

@Component({
  selector: 'vsn-combobox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex items-center">
      <input
        class="h-10 w-64 rounded-md border-gray-300 pl-4 pr-10 text-sm transition duration-150 placeholder:text-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
        placeholder="Filter by country"
        [value]="search()"
        (input)="onInputChange($event)"
        (focus)="onFocus()"
        (keydown.arrowdown)="onArrowDown()"
        (keydown.arrowup)="onArrowUp($event)"
        (keydown.enter)="onEnterKey($event)"
        (keydown.esc)="onEscKey()"
        (keydown.tab)="onTabKey()"
      />

      @if (result() === undefined) {
        <svg
          class="pointer-events-none absolute right-4 h-[18px] w-[18px] transition-transform"
          [ngClass]="{ 'rotate-180': isOpen() }"
          fill="none"
          shape-rendering="geometricPrecision"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      } @else {
        <svg
          (click)="onResetClick()"
          class="absolute right-4 h-4 w-4 cursor-pointer"
          stroke-linejoin="round"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
            fill="currentColor"
          ></path>
        </svg>
      }

      @if (isOpen()) {
        <div
          tabindex="-1"
          class="absolute left-0 top-12 max-h-64 w-64 space-y-2 overflow-auto rounded-md border bg-white p-2"
        >
          @for (
            country of filteredCountries();
            track country.id;
            let i = $index
          ) {
            <button
              #ref
              tabindex="-1"
              class="flex w-full items-center rounded p-2 hover:bg-gray-300"
              [ngClass]="{ 'bg-gray-200': hoveredIndex() === i }"
              (click)="onItemClick($event, country)"
            >
              <span
                class="mr-2 w-8 shrink-0 rounded bg-gray-50 px-2 py-0.5 text-xs font-light text-gray-500"
                >{{ country.id }}</span
              >
              <span class="truncate">{{ country.value }}</span>
            </button>
          } @empty {
            <div
              class="flex w-full items-center justify-center rounded p-2 text-center text-gray-400"
            >
              No items found.
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class Combobox implements OnInit, OnDestroy {
  search = signal('')
  isOpen = signal(false)
  hoveredIndex = signal(0)
  result = signal<Country | undefined>(undefined)

  filteredCountries = computed(() => {
    const s = this.search().toLowerCase()

    return countries.filter(({ id, value }) => {
      const i = id.toLowerCase()
      const v = value.toLowerCase()

      return i.includes(s) || v.includes(s)
    })
  })

  @ViewChildren('ref') refs!: QueryList<ElementRef>

  @Output() onResultChange = new EventEmitter<Country | undefined>()

  constructor(private elementRef: ElementRef) {
    effect(() => {
      this.onResultChange.emit(this.result())
    })
  }

  ngOnInit() {
    window.addEventListener('mousedown', this.handleOutsideClick)
  }

  ngOnDestroy() {
    window.removeEventListener('mousedown', this.handleOutsideClick)
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false)
    }
  }

  onInputChange({ target }: Event) {
    this.hoveredIndex.set(0)
    this.isOpen.set(true)

    const { value } = target as HTMLInputElement

    this.search.set(value)
    this.scrollToItem()
  }

  onResetClick() {
    this.result.set(undefined)
    this.search.set('')
    this.hoveredIndex.set(0)
  }

  onItemClick(event: Event, country: Country) {
    event.preventDefault()

    this.result.set(country)
    this.search.set(country.value)
    this.isOpen.set(false)
  }

  onFocus() {
    this.isOpen.set(true)
  }

  onArrowDown() {
    if (this.hoveredIndex() >= this.filteredCountries().length - 1) {
      this.hoveredIndex.set(0)
    } else {
      const value = this.hoveredIndex() + 1

      this.hoveredIndex.set(value)
    }

    this.scrollToItem()
  }

  onArrowUp(event: Event) {
    event.preventDefault()

    if (this.hoveredIndex() <= 0) {
      this.hoveredIndex.set(this.filteredCountries().length - 1)
    } else {
      const value = this.hoveredIndex() - 1

      this.hoveredIndex.set(value)
    }

    this.scrollToItem()
  }

  scrollToItem() {
    const el = this.refs.toArray()[this.hoveredIndex()]

    if (el) {
      el.nativeElement.scrollIntoView({
        block: 'center',
      })
    }
  }

  onEscKey() {
    if (this.result()) {
      this.search.set(this.result()!.value)
    } else {
      this.search.set('')
    }

    this.hoveredIndex.set(0)
    this.isOpen.set(false)
  }

  onEnterKey(event: Event) {
    event.preventDefault()

    if (this.filteredCountries().length > 0) {
      const country = this.filteredCountries()[this.hoveredIndex()]

      this.result.set(country)
      this.search.set(country.value)
      this.isOpen.set(false)
    }
  }

  onTabKey() {
    if (this.filteredCountries().length > 0) {
      const country = this.filteredCountries()[this.hoveredIndex()]

      this.result.set(country)
      this.search.set(country.value)
      this.isOpen.set(false)
    }
  }
}
