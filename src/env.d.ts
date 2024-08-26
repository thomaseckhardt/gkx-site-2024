/// <reference types="astro/client" />
import { Alpine as AlpineType } from 'alpinejs'

declare global {
  var Alpine: AlpineType
  var Splide: any
}
