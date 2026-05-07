import type { Payload, Response } from "@/types/data";

// A wrapper for the google.script.run API
export async function runMacro(macroName: string, payload?: Payload): Promise<Response> {
  return new Promise((resolve, reject) => {
    google
      .script
      .run
      .withSuccessHandler((response: Response) => resolve(response))
      .withFailureHandler((error: unknown) => reject(error))
      .dispatch(macroName, payload);
  });
}
