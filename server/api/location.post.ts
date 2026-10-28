import { insertLocation, location } from "../lib/db/schema/location";
import db from "../lib/db/index";
import type { DrizzleError} from "drizzle-orm";
import { eq } from "drizzle-orm";
import slugify from "slug";
import { customAlphabet } from "nanoid";

import { findLocationByName } from "../lib/db/queries/location";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, insertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues
      .map((issue) => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result.error.issues.reduce(
      (errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      },
      {} as Record<string, string>,
    );
    return sendError(
      event,
      createError({
        statusCode: 422,
        statusMessage: statusMessage || "Invalid Body",
        data,
      }),
    );
  }

  let slug = slugify(result.data.name);

  let existingLocation = await findLocationByName(
    result.data,
    event.context.user.id,
  );

  if (existingLocation) {
    return sendError(
      event,
      createError({
        statusCode: 409,
        statusMessage: "Location with this name already exists",
      }),
    );
  }

  const nanoid = customAlphabet("1234567890abcdef", 5);

  while (existingLocation) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existingLocation = await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    });
    if (!existingLocation) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db
      .insert(location)
      .values({
        ...result.data,
        slug,
        userId: event.context.user.id,
      })
      .returning();

    return created;
  } catch (e) {
    const error = e as DrizzleError;
    if (error.message.includes("UNIQUE constraint failed: location.slug")) {
      return sendError(
        event,
        createError({
          statusCode: 422,
          statusMessage:
            "Slug must be unique (the location name is used to generate the slug).",
        }),
      );
    }
    throw error;
  }
});
