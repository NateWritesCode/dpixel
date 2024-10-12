import { z } from "zod";

export const ZCollect = z.object({
   action: z.string().nullable(),
   browserType: z.string(),
   fbcCookie: z.string().nullable(),
   timestamp: z.string(),
   url: z.string().url(),
});

export type TCollect = z.infer<typeof ZCollect>;
