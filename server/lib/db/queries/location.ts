import type { InsertLocation} from "../schema/location";
import { location } from "../schema/location";
import { and, eq } from "drizzle-orm";
import db from "../index";

export async function findLocationByName(
  existing: InsertLocation,
  userId: number,
) {
  return db.query.location.findFirst({
    where: and(eq(location.name, existing.name), eq(location.userId, userId)),
  });
}

export default function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}
