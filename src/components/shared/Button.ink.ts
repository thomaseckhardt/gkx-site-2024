import type { InkConfig } from '@/utils/ink'
import clsx from 'clsx'

const FIXED_CLASSES = clsx(
  'group relative z-10 inline-block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'font-narrow uppercase tracking-wider',
)

export const config: InkConfig = {
  variants: {
    DEFAULT: {
      root: clsx(FIXED_CLASSES),
      body: 'rounded-full border border-black',
    },
  },
  colors: {
    DEFAULT: {
      DEFAULT: {
        body: 'text-black bg-accent focus-visible:outline-accent',
      },
    },
  },
  sizes: {
    DEFAULT: {
      DEFAULT: {
        root: 'py-3 -my-3 text-lg leading-none',
        body: 'py-0.25 px-2',
      },
    },
  },
}
