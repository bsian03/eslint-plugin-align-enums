# align-enums

Enforces spacing around enum assignments. Similar to @stylistic/key-spacing.

## Options
- `"beforeEqual": true (default) | false`
  - `true`: requires one space between the enum key name and the assignment operator
  - `false`: disallows spaces between the enum key and the assignment operator
- `"afterColon": true (default) | false`
  - `true`: requires one space between the assignment operator and the enum value
  - `false`: disallows spaces between the assignment operator and the enum value
- `"align": "equals" (default) | "value"`
  - `"equals"`: enforces horizontal alignment of both assignment operator and enum values
  - `"value"`: enforces horizontal alignment of only enum values
