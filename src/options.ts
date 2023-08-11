import { ValueOrFactory } from "value-or-factory"
import { FormContext } from "./form"
import { FormHooks } from "./hooks"

export type FormSubmitter<T> = (value: T) => FormError[] | void | Promise<FormError[] | void>
export type FormValidator<T> = (value: T) => FormError[] | void | Promise<FormError[] | void>
export type FormComparer<T> = "deep" | "shallow" | ((a: T, b: T) => boolean)
export type FormAction<T> = "submit" | "validate" | ((actions: FormContext<T>) => void)

/**
 * Form setup options.
 * @typeParam T The value type.
 */
export interface FormOptions<T> {

    /**
     * Submission function for the form. If this throws an exception, it will be thrown within React. If you want to handle errors, make sure to return a FormError[].
     */
    readonly submit: FormSubmitter<T>

    /**
     * Validation function for the form. Should return an array of errors (empty if validation is successful). If this throws an exception, it will be thrown within React. If you want to handle errors, make sure to return a FormError[].
     */
    readonly validate?: FormValidator<T>

    /**
     * Whether or not to run a validation before submission. Default `true`. You can also pass a custom validation function.
     * @defaultValue `true`
     */
    readonly submitValidate?: FormValidator<T>

    /**
     * The initial data for the form. Memoize this for performance benefits.
     */
    readonly initialValue: T

    /**
     * Whether or not the form should update if the initialValue property changes (based on a deep comparison - or using the customCompare option).
     * @defaultValue `false`
     */
    readonly autoReinitialize?: ValueOrFactory<boolean, [T]>

    /**
     * A custom comparison function for determining whether or not the data has changed (used for re-initialization as isDirty flag). The default strips out all nulls, undefined, empty arrays, empty objects, zeros, and blank strings before comparing.
     */
    readonly comparer?: FormComparer<T>

    /**
     * Specify actions to be executed on form hooks.
     */
    readonly on?: FormHooks<T>

}

/**
 * Error object for a form field.
 */
export type FormError = {

    /**
     * The error message.
     */
    readonly message: string

    /**
     * A path for an error. Strings represent properties, numbers represent array indexes.
     */
    readonly path: readonly (string | number)[]

}