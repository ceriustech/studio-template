# Data Model: Process section

No Sanity schema changes. All content for this feature is static and hardcoded in the `Process` component (see [research.md](./research.md) — Decision: Content source), matching the existing precedent set by the `Services` section on the same route.

## Entities

### ProcessStep (in-component type, not a Sanity content type)

Represents a single stage in the organizing process, rendered in fixed order.

| Field         | Type     | Required | Notes                                                              |
| ------------- | -------- | -------- | ------------------------------------------------------------------- |
| `number`      | `string` | Yes      | Display order label, e.g. `"01"`, `"02"`, `"03"` (zero-padded).     |
| `title`       | `string` | Yes      | Step title, e.g. `"Consultation"`.                                  |
| `description` | `string` | Yes      | One-sentence description of the step.                               |

Defined in `Process.types.ts`:

```ts
export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ProcessProps = {};
```

### Fixed content (from spec FR-003, sourced from the design mockup)

| number | title           | description                                                                          |
| ------ | --------------- | ------------------------------------------------------------------------------------- |
| 01     | Consultation    | Free 30-minute video or in-person assessment of your space and goals                  |
| 02     | Design + shop   | Custom plan, product sourcing, and everything you need before we arrive               |
| 03     | Organizing day  | We sort, declutter, build systems, label, and style your space to perfection          |

No relationships, no state transitions, no validation rules beyond "all three fields are non-empty strings" — this is static presentational content, not user input.
