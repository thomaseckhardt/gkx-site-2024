import clsx from 'clsx'
import intersection from 'lodash/intersection'

export interface InkConfig {
  variants?: InkVariants
  colors?: InkColors
  sizes?: InkSizes
}

export interface InkVariants {
  DEFAULT: InkElement
  [key: string]: InkElement
}

export interface InkColors {
  DEFAULT: InkVariants
  [key: string]: InkVariants
}

export interface InkSizes {
  [key: string]: InkVariants
}

export interface InkElement {
  [key: string]: string | number | boolean
}

const FIXED = 'FIXED'
const DEFAULT = 'DEFAULT'

// TODO: Specify type for `set`
const getConfig = (set: any, key: string) => {
  if (!set) return {}
  if (!set[key] && key !== FIXED) {
    key = DEFAULT
  }
  if (key === DEFAULT && typeof set[key] === 'string') {
    key = set[key]
  }

  const setConfig = set[key] || {}

  return setConfig
}

type InkClassesFunc = {
  elem: string | undefined
  config: InkConfig
  variant?: string
  color?: string
  size?: string
}

export const inkClasses = ({
  elem,
  config = {},
  variant = DEFAULT,
  color = DEFAULT,
  size = DEFAULT,
}: InkClassesFunc) => {
  if (!elem) return ''

  const { variants = {}, sizes = {}, colors = {} } = config
  if (!variants) return ''

  const variantSetFixed = getConfig(variants, FIXED)
  const variantSet = getConfig(variants, variant)
  const sizeSetFixed = getConfig(getConfig(sizes, variant), FIXED)
  const sizeSet = getConfig(getConfig(sizes, variant), size)
  const colorSetFixed = getConfig(getConfig(colors, color), FIXED)
  const colorSet = getConfig(getConfig(colors, color), variant)

  const classes = [
    variantSetFixed[elem],
    variantSet[elem],
    sizeSetFixed[elem],
    sizeSet[elem],
    colorSetFixed[elem],
    colorSet[elem],
  ]
    .filter(Boolean)
    .join(' ')

  return classes
}

type InkPropFunc = {
  elem: string | undefined
  config: InkConfig
  variant?: string
  color?: string
  size?: string
}

export const inkProp = ({
  elem,
  config = {},
  variant = DEFAULT,
  color = DEFAULT,
}: InkPropFunc) => {
  if (!elem) return ''

  const { variants = {}, colors = {} } = config

  const variantSetFixed = getConfig(variants, FIXED)
  const variantSet = getConfig(variants, variant)
  const colorSetFixed = getConfig(getConfig(colors, color), FIXED)
  const colorSet = getConfig(getConfig(colors, color), variant)

  const prop =
    colorSet[elem] ||
    colorSetFixed[elem] ||
    variantSet[elem] ||
    variantSetFixed[elem]

  return prop
}

type DefineInkFunc = {
  config: InkConfig
  variant?: string
  color?: string
  size?: string
}

const getInkDefinitionsFromProps = (definitions, props) => {
  return intersection(definitions, props)
}

const getInkDefinitionFromProps = (definitions, props): string => {
  const [definition] = getInkDefinitionsFromProps(definitions, props) || []
  return String(definition)
}

export const defineInk = ({ config, ...props }: DefineInkFunc) => {
  const { variant, color, size } = props

  // Make it possible to pass variant/color/size value directly as property
  // <Button contained indigo xs /> instead of
  // <Button variant="contained" color="indigo" size="xs" />
  const definedVariants = Object.keys(config?.variants ?? {})
  const definedColors = Object.keys(config?.colors ?? {})
  const definedSizes = [
    ...new Set(
      [
        ...Object.values(config?.sizes || {}).map((variant) =>
          Object.keys(variant),
        ),
      ].flat(),
    ),
  ]
  const propKeys = Object.keys(props)
  const variantFromProps = getInkDefinitionFromProps(definedVariants, propKeys)
  const colorFromProps = getInkDefinitionFromProps(definedColors, propKeys)
  const sizeFromProps = getInkDefinitionFromProps(definedSizes, propKeys)
  const inkVariant = variant || variantFromProps
  const inkColor = color || colorFromProps
  const inkSize = size || sizeFromProps

  const inkFunc = (
    elem: string | undefined,
    ...additionalClasses: string[]
  ) => {
    const className = clsx(
      elem
        ? inkClasses({
            elem,
            config,
            variant: inkVariant,
            color: inkColor,
            size: inkSize,
          })
        : undefined,
      ...additionalClasses,
    )
    return className !== '' ? className : undefined
  }
  const inkPropFunc = (elem: string | undefined) => {
    return inkProp({
      elem,
      config,
      variant: inkVariant,
      color: inkColor,
      size: inkSize,
    })
  }
  return { ink: inkFunc, inkProp: inkPropFunc }
}
