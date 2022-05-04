import { z } from 'zod';
import * as trpc from '@trpc/server';

// define the schema for the request using zod
const Cat = z.object({
  id: z.number(),
  name: z.string(),
});
const Cats = z.array(Cat);

let cats: Cat[] = [];

const newId = (): number => Math.floor(Math.random() * 100000);

const trpcRouter = trpc.router()
  .query('get', {
    input: z.number(),
    output: z.object({ cat: Cat, message: z.string() }),
    async resolve(req) {
      const cat = cats.find((cat) => cat.id === req.input);

      if (!cat) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: `Could not find cat with id ${req.input}`,
        });
      }

      return { cat, message: `Found cat ${cat.name}` };
    },
  })
  .query('list', {
    output: z.object({ cats: Cats, total: z.number(), message: z.string() }),
    async resolve() {
      if (cats.length === 0) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'No cats found',
        });
      }

      return { cats, total: cats.length, message: 'Cats found' };
    },
  })
  .mutation('create', {
    input: z.object({ name: z.string().max(50) }),
    output: z.object({ cat: Cat, message: z.string() }),
    async resolve(req) {
      const newCat: Cat = { id: newId(), name: req.input.name };
      cats.push(newCat);

      return { cat: newCat, message: 'Cat created' };
    },
  })
  .mutation('update', {
    input: z.object({ id: z.number(), name: z.string().max(50) }),
    output: z.object({ cat: Cat, message: z.string() }),
    async resolve(req) {
      const cat = cats.find((cat) => cat.id === req.input.id);

      if (!cat) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: `Could not find cat with id ${req.input.id}`,
        });
      }

      cat.name = req.input.name;

      return { cat, message: 'Cat updated' };
    },
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    output: z.object({ id: z.number(), message: z.string() }),
    async resolve(req) {
      const cat = cats.find((cat) => cat.id === req.input.id);

      if (!cat) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: `Could not find cat with id ${req.input}`,
        });
      }

      cats = cats.filter((cat) => cat.id !== req.input.id);

      return { id: req.input.id, message: 'Cat deleted' };
    },
  });

export type Cat = z.infer<typeof Cat>;
export type Cats = z.infer<typeof Cats>;
export type TRPCRouter = typeof trpcRouter;

export default trpcRouter;
