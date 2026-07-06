import { ToolProvider } from "./provider.interface.js";

export class EmailProvider implements ToolProvider {
  run(input: string): string {
    return `Generated Email

Subject: Follow Up

Hello,

I hope you are doing well.

I am writing to follow up regarding:

${input}

Please let me know if there is any update.

Thank you.

Best regards,`;
  }
}
