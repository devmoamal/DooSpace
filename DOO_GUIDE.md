# How to Create a Doo

A Doo is a serverless unit of logic in DooSpace, written in TypeScript. It uses a functional export pattern with a powerful orchestration driver.

## Basic Structure

```typescript
import { doobox, callDoo } from "doospace";

type Res = {
  ok: boolean;
  message: string;
  timestamp: string;
};

export default function (doo: Doo) {
  // Handle GET requests to /
  doo.get<Res>("/", async (req: DooRequest<undefined>): Promise<Res> => {
    doo.log("Request received at root");

    return {
      ok: true,
      message: "Welcome to DooSpace!",
      timestamp: new Date().toISOString(),
    };
  });
}
```

## Orchestration & Drivers

### `doo` Object

Passed to the default function, used to define routes and logs.

- `doo.get<T>(path, handler)`
- `doo.post<T>(path, handler)`
- `doo.put<T>(path, handler)`
- `doo.delete<T>(path, handler)`
- `doo.log(message)`: System logging for debugging.

### `doobox` (Persistence)

Key-value storage for state management.

- `await doobox.get(key)`
- `await doobox.set(key, value, expireAt?)`
- `await doobox.delete(key)`
- `await doobox.list()`

### `callDoo` (Inter-Doo Communication)

Call other Doos directly from your code.

- `await callDoo.get(dooId, path, params?)`
- `await callDoo.post(dooId, path, body?)`

## Contextual Types

- `DooRequest<T>`: The request object containing `json()`, `params`, `query`, and `headers`.
- `Promise<T>`: Handlers must return a promise resolving to the response type.

## Example: Advanced Orchestration

```typescript
import { doobox, callDoo } from "doospace";

export default function (doo: Doo) {
  doo.post("/process", async (req) => {
    const body = await req.json();

    // Save to local storage
    await doobox.set("last_request", body);

    // Chain call another service
    const result = await callDoo.post(15, "/analyze", body);

    return { status: "processed", analysis: result };
  });
}
```

## Constraints

- Use `import { doobox, callDoo } from "doospace";` at the top.
- Always `export default function (doo: Doo) { ... }`.
- Use `doo.get/post/etc` inside the default function.
- Do not use `ctx` as it is deprecated.
