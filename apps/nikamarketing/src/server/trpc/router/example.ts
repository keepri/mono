import { z } from "zod";
import { procedure, protectedProcedure, router } from "../utils";

export default router({
    hello: procedure.input(z.object({ name: z.string() })).query(({ input }) => `Hello ${input.name}`),
    random: procedure
        .input(z.object({ num: z.number() }))
        .mutation(({ input }) => Math.floor(Math.random() * 100) / input.num),
    secret: protectedProcedure.query(({ ctx }) => `This is top secret - ${ctx.session.user.name ?? "NoName"}`),
});
