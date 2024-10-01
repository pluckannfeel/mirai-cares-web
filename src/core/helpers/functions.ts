/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors } from "formik";

export function getNestedError<T>(
  path: string,
  errors: FormikErrors<T>
): string | undefined {
  const parts = path.split(".");
  let current: any = errors;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    } else if (typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}
