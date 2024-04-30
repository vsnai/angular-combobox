import { bootstrapApplication } from '@angular/platform-browser'
import { App } from './components/app'
import { provideRouter } from '@angular/router'

bootstrapApplication(App, {
  providers: [provideRouter([])],
}).catch((err) => console.error(err))
