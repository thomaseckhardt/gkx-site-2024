/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import { Alpine as AlpineType } from 'alpinejs'

declare global {
  namespace App {
    interface Locals {
      // @see https://docs.netlify.com/edge-functions/api/#netlify-specific-context-object
      netlify: {
        context: any
      }
    }
  }

  var Alpine: AlpineType
  var Splide: any
  var htmx: any
  var Hls: any
}
