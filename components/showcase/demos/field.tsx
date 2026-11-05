import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "vertical",
      render: () => (
        <Field>
          <FieldLabel htmlFor="field-name">Name</FieldLabel>
          <Input id="field-name" placeholder="Ada" />
          <FieldDescription>Shown on your profile.</FieldDescription>
        </Field>
      ),
    },
    {
      label: "horizontal",
      render: () => (
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="field-mail">Email</FieldLabel>
            <FieldDescription>I never spam.</FieldDescription>
          </FieldContent>
          <Input id="field-mail" placeholder="ada@x.dev" />
        </Field>
      ),
    },
    {
      label: "invalid",
      render: () => (
        <Field data-invalid="true">
          <FieldLabel htmlFor="field-bad">Handle</FieldLabel>
          <Input id="field-bad" aria-invalid defaultValue="a b" />
          <FieldError>No spaces allowed.</FieldError>
        </Field>
      ),
    },
    {
      label: "set",
      render: () => (
        <FieldSet>
          <FieldLegend>Account</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-user">User</FieldLabel>
              <Input id="field-user" />
            </Field>
            <FieldSeparator>or</FieldSeparator>
            <Field>
              <FieldLabel htmlFor="field-pass">Token</FieldLabel>
              <Input id="field-pass" />
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
  ],
}
