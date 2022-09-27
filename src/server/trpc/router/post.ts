import crypto from "crypto";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const getslug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const postRouter = t.router({
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });
  }),
  findBySlug: t.procedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      const post = ctx.prisma.post.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          title: true,
          body: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return post;
    }),
  /*getViews: t.procedure.input(z.object({slug: z.string()})).query(({ctx,input})=>{
      const views = await ctx.prisma.views.findUnique({
        where: {
          slug,
        },
      });

      if (!views) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      const total = views.count.toString();

      return total;
    })*/
  createPost: t.procedure
    .use(authedProcedure)
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { title, body } = input;

      const slug = `${getslug(title)}-${crypto.randomBytes(2).toString("hex")}`;

      const user = ctx.session?.user;

      return ctx.prisma.post.create({
        data: {
          title,
          body /*: sanitizeHtml(body, {
                allowedTags: ["b", "i", "em", "strong", "a", "code"],
                allowedAttributes: {
                  a: ["href"],
                },
                allowedIframeHostnames: ["www.youtube.com"],
              })*/,
          slug,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
    }),
});
