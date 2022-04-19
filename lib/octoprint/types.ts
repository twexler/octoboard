export interface Message {
  connected?: ConnectMessage
  current?: CurrentMessage
  history?: CurrentMessage
  event?: EventMessage
  slicingProgress?: SlicingProgressMessage
  plugin?: PluginMessage
}

export interface PluginMessage {
  plugin: string
  data: any
}

export interface ConnectMessage {
  version: string
  display_version: string
  branch: string
  python_version: string
  plugin_hash: string
  config_hash: string
  debug: boolean
  safe_mode?: boolean
  online: boolean
  permissions: Map<string, any>
}

export interface CurrentMessage {
  state: CurrentState
  job: Job
  progress: Progress
  currentZ: number
  offsets: Map<string, number>
  temps: Array<Temperature>
  logs: Array<string>
  messages: Array<string>
  resends: Resends
  plugins: Map<string, any>
}

export interface CurrentState {
  text: string
  flags: Flags
  error: string
}

export interface Flags {
  operational: boolean
  printing: boolean
  pausing: boolean
  resuming: boolean
  closedOrError: boolean
  error: boolean
  sdReady: boolean
}

export interface Job {
  file: File
  estimatedPrintTime: number
  lastPrintTime: number
  filament: Map<string, number>
}

export interface File {
  name: string
  display: string
  path: string
  interface: string
  interfacePath: Array<string>
}

export interface Progress {
  completion: number
  filepos: number
  printTime: number
  printTimeLeft: number
  printTimeLeftOrigin: number
}

export interface Temperature {
  time: number
  [key: string]: TemperatureData | number
  bed: TemperatureData
}

export interface TemperatureData {
  actual: number
  target: number
  offset: number
}

export interface Resends {
  count: number
  last: number
  ratio: number
}

export interface EventMessage {
  interface: string
  payload: any
}

export interface SlicingProgressMessage {
  slicer: string
  source_location: string
  source_path: string
  dest_location: string
  dest_path: string
  progress: number
}

export interface LoginResponse {
  session: string
  name: string
  _is_external_client: boolean
}

export interface Settings {
  feature: Features
  folder: Folder
  printer: Printer
  scripts: Scripts
  serial: Serial
  system: System
  temperature: TemperatureSettings
  terminalFilters: Array<TerminalFilter>
  webcam: Webcam
}

export interface Features {
  gcodeViewer: boolean
  sizeThreshold: number
  mobileSizeThreshold: number
}

export interface Folder {
  timelapseTmp: string
}

export interface Printer {
  defaultExtrusionLength: number
}

export interface Scripts {
  gcode: GcodeScripts
  snippets: Map<string, string>
}

export interface GcodeScripts {
  afterPrinterConnected: string
  beforePrintStarted: string
  afterPrintDone: string
  afterPrintCancelled: string
  afterPrintPaused: string
  afterPrintResumed: string
}

export interface Serial {
  port: string
  baudrate: number
  portOptions: Array<string>
  baudrateOptions: Array<number>
  timeoutConnection: number
  timeoutDetection: number
  timeoutCommunication: number
  timeoutTemperature: number
  timeoutSdStatus: number
  maxTimeoutsIdle: number
  maxTimeoutsPrinting: number
  maxTimeoutsLong: number
}

export interface System {
  actions: Array<Action>
  events: any //wtf is this
}

export interface Action {
  name: string
  action: string
  command: string
  confirm: string
}

export interface TemperatureSettings {
  profiles: Array<TemperatureProfile>
}

export interface TemperatureProfile {
  name: string
  extruder: number
  bed: number
}

export interface TerminalFilter {
  name: string
  regex: string
}

export interface Webcam {
  streamUrl: string
  snapshotUrl: string
  ffmpegPath: string
}