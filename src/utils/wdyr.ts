import React from 'react'
import { performanceLogger } from './performanceLogger'

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: false,
    logOwnerReasons: true,
    logOnDifferentValues: true,
    collapseGroups: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notifier: (info: Record<string, any>) => {
      const name: string =
        info.displayName ||
        info.Component?.displayName ||
        info.Component?.name ||
        'Unknown'
      performanceLogger.logUnnecessaryRender(name)
    },
  })
}
