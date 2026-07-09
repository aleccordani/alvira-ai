import { toNodeHandler } from "better-auth/node";

import { auth } from "../../../lib/auth.js";

export const betterAuthHandler = toNodeHandler(auth);