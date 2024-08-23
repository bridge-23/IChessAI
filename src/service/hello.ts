import { createReactor } from "@ic-reactor/react";
import { canisterId, chess23, idlFactory } from "declarations/chess23";
export const { initialize, useQueryCall } = createReactor<typeof chess23>({
  canisterId,
  idlFactory,
  withLocalEnv: true,
});
