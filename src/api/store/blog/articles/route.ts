import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { getStoreArticlesRoute } from "../../../../utils/get-store-articles-route";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  return getStoreArticlesRoute(req, res);
};
