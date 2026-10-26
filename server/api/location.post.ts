import { insertLocation, location  } from "../lib/db/schema/location";
import db from "../lib/db/index";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }),
    );
  }

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

  const [created] = await db
    .insert(location)
    .values({
      ...result.data,
      slug: result.data.name.replaceAll(" ", "-").toLowerCase(),
      userId: event.context.user.id,
    })
    .returning();

  return created;
});
