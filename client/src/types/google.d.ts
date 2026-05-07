export { }

declare global {
  const google: {
    script: {
      run: {
        withSuccessHandler: (handler: (result: any) => void) => typeof google.script.run,
        withFailureHandler: (handler: (error: unknown) => void) => typeof google.script.run,
        requestHandler: (method: string, service: string, data: any) => void
        dispatch: (macroName: string, payload?: any) => void
      }
    }
  }
}