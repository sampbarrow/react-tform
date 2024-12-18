import { createContext } from "react"
import { ValueOrFactory } from "value-or-factory"
import { FormErrorInput } from "./errors"
import { FormHook } from "./hooks"
import { FormState } from "./state"

export type FormValidationResult = FormErrorInput | void | PromiseLike<FormErrorInput | void>
export type FormSubmissionResult = FormErrorInput | void | PromiseLike<FormErrorInput | void>
export type FormValidator<T> = (value: T) => FormValidationResult
export type FormSubmitter<T> = (value: T) => FormSubmissionResult

/**
 * Form setup options.
 * @typeParam T The value type.
 */
export interface FormOptions<T> {

    /**
     * The initial data for the form. Memoize this for performance benefits.
     */
    readonly initialValue: T

    /**
     * Whether or not the form should update if the initialValue property changes.
     * @defaultValue `false`
     */
    readonly autoReinitialize?: ValueOrFactory<boolean, [FormState<T>]> | undefined

    /**
     * Submission function for the form. If this throws an exception, it will be thrown within React. If you want to handle errors, make sure to return a FormError[].
     */
    readonly submit: FormSubmitter<T>

    /**
     * Validation function for the form. Should return an array of errors (empty if validation is successful). If this throws an exception, it will be thrown within React. If you want to handle errors, make sure to return a FormError[].
     */
    readonly validate?: FormValidator<T> | undefined

    /**
     * Disable the form.
     */
    readonly disabled?: boolean | undefined

    /**
     * Specify actions to be executed on form hooks.
     */
    readonly on?: FormActions | undefined

}

export type FormAction = "submit" | "validate" | (() => void)

/**
 * A map of event types to actions.
 */
export type FormActions = {

    readonly [K in FormHook]?: FormAction | readonly FormAction[]

}

export const FormDefaults = createContext<FormActions>({})
