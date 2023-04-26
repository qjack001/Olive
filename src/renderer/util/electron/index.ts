import { listenForOperatingSystemChanges } from './environment'

export * from './channels'
export * from './environment'

// needs to be run after everything else, so that OPERATING_SYSTEM channel exists
listenForOperatingSystemChanges()