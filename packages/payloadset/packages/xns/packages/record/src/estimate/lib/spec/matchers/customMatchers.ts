interface ExpectationResult {
  actual?: unknown
  expected?: unknown
  message: () => string
  pass: boolean
}

function toBeType(received: unknown, expectedType: string): ExpectationResult {
  const pass = typeof received === expectedType && !Number.isNaN(received)
  return pass
    ? {
        message: () => `expected ${received} not to be a ${expectedType}`,
        pass: true,
      }
    : {
        message: () => `expected ${received} to be a ${expectedType}`,
        pass: false,
      }
}

export const matchers = {
  toBeArrayOfSize(received: unknown, expectedSize: number): ExpectationResult {
    const pass = Array.isArray(received) && received.length === expectedSize
    return pass
      ? {
          message: () => `expected array not to have size ${expectedSize}, but received array of size ${received.length}`,
          pass: true,
        }
      : {
          message: () => Array.isArray(received)
            ? `expected array of size ${expectedSize}, but received array of size ${received.length}`
            : `expected array of size ${expectedSize}, but received a non-array`,
          pass: false,
        }
  },
  toBeArray(received: unknown): ExpectationResult {
    const pass = Array.isArray(received)
    return pass
      ? {
          message: () => 'expected array',
          pass: true,
        }
      : {
          message: () => `expected array, but received ${typeof received}`,
          pass: false,
        }
  },
  toBeOneOf(received: unknown, expected: unknown[]): ExpectationResult {
    const pass = expected.includes(received)
    return pass
      ? {
          pass: true,
          message: () =>
            `expected ${received} not to be one of ${JSON.stringify(expected)}`,
        }
      : {
          pass: false,
          message: () =>
            `expected ${received} to be one of ${JSON.stringify(expected)}`,
        }
  },
  toBeNegative(received: number): ExpectationResult {
    if (typeof received !== 'number') {
      throw new TypeError(`Expected a number, but received ${typeof received}`)
    }

    const pass = received < 0
    return pass
      ? {
          pass: true,
          message: () =>
            `expected ${received} not to be negative`,
        }
      : {
          pass: false,
          message: () =>
            `expected ${received} to be negative`,
        }
  },
  toBePositive(received: number): ExpectationResult {
    if (typeof received !== 'number') {
      throw new TypeError(`Expected a number, but received ${typeof received}`)
    }

    const pass = received > 0
    return pass
      ? {
          pass: true,
          message: () =>
            `expected ${received} not to be positive`,
        }
      : {
          pass: false,
          message: () =>
            `expected ${received} to be positive`,
        }
  },
  toBeNumber: (received: unknown) => toBeType(received, 'number'),
  toBeFunction: (received: unknown) => toBeType(received, 'function'),
  toBeString: (received: unknown) => toBeType(received, 'string'),
  toBeObject(received: unknown): ExpectationResult {
    const pass = typeof received === 'object' && !Array.isArray(received) && received !== null
    return pass
      ? {
          message: () => `expected ${received} to be object`,
          pass: true,
        }
      : {
          message: () => `expected ${received} to be an object but was ${Array.isArray(received) ? 'array' : typeof received}`,
          pass: false,
        }
  },
  toBeInteger(received: number): ExpectationResult {
    if (typeof received !== 'number') {
      throw new TypeError(`Expected a number, but received ${typeof received}`)
    }

    const pass = Number.isInteger(received)
    return pass
      ? {
          pass: true,
          message: () =>
            `expected ${received} not to be an integer`,
        }
      : {
          pass: false,
          message: () =>
            `expected ${received} to be an integer`,
        }
  },
  toBeFalse(received: unknown): ExpectationResult {
    const pass = received === false
    return pass
      ? {
          message: () => `expected ${received} to be false`,
          pass: true,
        }
      : {
          message: () => `expected ${received} to be false but was not false`,
          pass: false,
        }
  },
  toBeTrue(received: unknown): ExpectationResult {
    const pass = received === true
    return pass
      ? {
          message: () => `expected ${received} to be true`,
          pass: true,
        }
      : {
          message: () => `expected ${received} to be true but was not true`,
          pass: false,
        }
  },
  toIncludeAllMembers(received: unknown[], expected: unknown[]): ExpectationResult {
    if (!Array.isArray(received) || !Array.isArray(expected)) {
      return {
        pass: false,
        message: () => 'Expected both received and expected values to be arrays.',
      }
    }

    const missingMembers = expected.filter(item => !received.includes(item))

    return missingMembers.length === 0
      ? {
          pass: true,
          message: () =>
            `Expected array not to include all members of ${JSON.stringify(expected)}, but it does.`,
        }
      : {
          pass: false,
          message: () =>
            `Expected array to include all members of ${JSON.stringify(expected)}. Missing members: ${JSON.stringify(
              missingMembers,
            )}.`,
        }
  },
  toContainAllKeys(received: object, expectedKeys: string[]): ExpectationResult {
    if (typeof received !== 'object' || received === null) {
      return {
        pass: false,
        message: () => `Expected ${JSON.stringify(received)} to be an object.`,
      }
    }

    if (!Array.isArray(expectedKeys)) {
      return {
        pass: false,
        message: () => `Expected keys to be an array, but received ${JSON.stringify(expectedKeys)}.`,
      }
    }

    const missingKeys = expectedKeys.filter(key => !(key in received))

    return missingKeys.length === 0
      ? {
          pass: true,
          message: () =>
            `Expected object not to contain all keys ${JSON.stringify(expectedKeys)}, but it does.`,
        }
      : {
          pass: false,
          message: () =>
            `Expected object to contain all keys ${JSON.stringify(expectedKeys)}. Missing keys: ${JSON.stringify(
              missingKeys,
            )}.`,
        }
  },
  toContainValues(received: object, expectedValues: unknown[]): ExpectationResult {
    if (typeof received !== 'object' || received === null) {
      return {
        pass: false,
        message: () => `Expected ${JSON.stringify(received)} to be an object.`,
      }
    }

    if (!Array.isArray(expectedValues)) {
      return {
        pass: false,
        message: () => `Expected values to be an array, but received ${JSON.stringify(expectedValues)}.`,
      }
    }

    const objectValues = Object.values(received)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deepEqual = (a: any, b: any): boolean => {
      if (a === b) return true
      if (typeof a !== typeof b) return false
      if (a && b && typeof a === 'object') {
        const aKeys = Object.keys(a)
        const bKeys = Object.keys(b)
        if (aKeys.length !== bKeys.length) return false
        return aKeys.every(key => deepEqual(a[key], b[key]))
      }
      return false
    }

    const missingValues = expectedValues.filter(
      expectedValue => !objectValues.some(value => deepEqual(value, expectedValue)),
    )

    return missingValues.length === 0
      ? {
          pass: true,
          message: () =>
            `Expected object not to contain all values ${JSON.stringify(expectedValues)}, but it does.`,
        }
      : {
          pass: false,
          message: () =>
            `Expected object to contain all values ${JSON.stringify(expectedValues)}. Missing values: ${JSON.stringify(
              missingValues,
            )}.`,
        }
  },
  toBeEmpty(received: unknown): ExpectationResult {
    let isEmpty = false

    if (Array.isArray(received) || typeof received === 'string') {
      isEmpty = received.length === 0
    } else if (received && typeof received === 'object') {
      isEmpty = Object.keys(received).length === 0
    } else if (received instanceof Map || received instanceof Set) {
      isEmpty = received.size === 0
    } else {
      return {
        pass: false,
        message: () =>
          `Expected value to be an empty array, string, object, Map, or Set, but received ${typeof received}.`,
      }
    }

    return isEmpty
      ? {
          pass: true,
          message: () =>
            'Expected value not to be empty, but it was.',
        }
      : {
          pass: false,
          message: () =>
            'Expected value to be empty, but it was not.',
        }
  },
}
