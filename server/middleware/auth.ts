import { auth } from "../lib/auth";

// Middleware to protect the /dashboard route and redirect unauthenticated users to sign in page

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/dashboard")) {
    const session = await auth.api.getSession({
      headers: event.headers,
    });
    if (!session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
