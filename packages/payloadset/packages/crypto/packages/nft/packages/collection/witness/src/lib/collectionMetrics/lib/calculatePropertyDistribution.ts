import { Distribution } from './distribution.ts'

export const calculatePropertyDistribution = <T>(array: T[], property: keyof T): Distribution<T> => {
  const distribution: Distribution<T> = {}
  for (const item of array) {
    const value = item[property]
    if (value !== undefined && value !== null) {
      const valueString = value.toString()
      if (!distribution[property]) {
        distribution[property] = { [valueString]: 1 }
      } else if (distribution[property]![valueString]) {
        ;(distribution[property] as Record<string, number>)[valueString] += 1
      } else {
        ;(distribution[property] as Record<string, number>)[valueString] = 1
      }
    }
  }
  return distribution
}
