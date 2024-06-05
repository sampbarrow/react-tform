import { equals } from "ramda"
import { useMemo, useState } from "react"
import { ValueOrFactory, callOrGet } from "value-or-factory"
import { FormError } from "./errors"
import { FormOptions } from "./options"
import { useDeepCompareConstant } from "./util"

/**
 * A form's internal state.
 */
export interface FormInternalState<T> {

    /**
     * The current value of the form.
     */
    readonly value: T

    /**
     * The initialized value of the form.
     */
    readonly initializedValue: T

    /**
     * The form's errors.
     */
    readonly errors?: readonly FormError[] | undefined

    /**
     * The most recently submitted value.
     */
    readonly submittedValue?: T | undefined

    /**
     * The number of times the form was successfully submitted.
     */
    readonly submitCount: number

    /**
     * The last exception to occur within submission or validation.
     */
    readonly exception?: unknown

    readonly lastInitialized: Date
    readonly lastBlurred?: Date | undefined
    readonly lastChanged?: Date | undefined
    readonly lastCommitted?: Date | undefined
    readonly lastFocused?: Date | undefined
    readonly lastSubmitted?: Date | undefined
    readonly lastValidated?: Date | undefined

    readonly lastSubmitRequested?: Date | undefined
    readonly isSubmitting: boolean

    readonly lastValidateRequested?: Date | undefined
    readonly isValidating: boolean

}

/**
 * Build the initial form state.
 * @param initialValue The form's value.
 * @returns An initial form state.
 */
export function initialFormState<T>(initialValue: T) {
    return {
        lastInitialized: new Date(),
        initializedValue: initialValue,
        value: initialValue,
        submitCount: 0,
        isSubmitting: false,
        isValidating: false,
    }
}

export function useFormState<T>(options: FormOptions<T>) {

    const [state, setState] = useState<FormInternalState<T>>(initialFormState(options.initialValue))

    const isInvalid = state.errors === undefined ? undefined : state.errors.length !== 0
    const isValid = state.errors === undefined ? undefined : state.errors.length === 0
    const canSubmit = state.errors === undefined ? true : !state.errors.some(_ => _.temporary !== true)

    const isDirty = useMemo(() => (state.lastChanged?.getTime() ?? 0) > state.lastInitialized.getTime() && !equals(state.value, state.initializedValue), [state.value, state.initializedValue])
    const isDirtySinceSubmitted = useMemo(() => (state.lastChanged?.getTime() ?? 0) > (state.lastSubmitted?.getTime() ?? 0) && !equals(state.value, state.submittedValue ?? state.initializedValue), [state.value, state.submittedValue ?? state.initializedValue])

    const hasBeenSubmitted = state.lastSubmitted !== undefined
    const hasBeenValidated = state.lastValidated !== undefined

    const isFocused = (state.lastFocused?.getTime() ?? 0) > (state.lastBlurred?.getTime() ?? 0)
    const isBlurred = (state.lastBlurred?.getTime() ?? 0) > (state.lastFocused?.getTime() ?? 0)

    //TODO rename to clarify dif between initial vs initilized value?
    const initialValue = useDeepCompareConstant(options.initialValue)
    const initialValueDirty = useMemo(() => !equals(initialValue, state.initializedValue), [initialValue, state.initializedValue])

    //TODO do we need sinceSubmitted, sinceValidated, etc

    const value = {
        ...state,
        canSubmit,
        isValid,
        isInvalid,
        initialValue,
        initialValueDirty,
        isDirty,
        isDirtySinceSubmitted,
        hasBeenSubmitted,
        hasBeenValidated,
        isFocused,
        isBlurred,
    }

    return {
        value,
        set: (value: React.SetStateAction<FormInternalState<T>>) => {
            setState(value)
        },
        patch: (partial: ValueOrFactory<Partial<FormInternalState<T>>, [FormInternalState<T>]>) => {
            setState(state => {
                return {
                    ...state,
                    ...callOrGet(partial, state),
                }
            })
        },
    }

}

export interface FormState<T> extends FormInternalState<T> {

    /**
     * The latest initial value passed to the form. Not necessarily the form's initialized value.
     */
    readonly initialValue: T

    /**
     * Whether the latest initial value passed to the form is the same as the form's initialized value.
     */
    readonly initialValueDirty: boolean

    /**
     * Whether or not the form is ready for submission. Either it has been validated, there is no validator required, or it failed validation but all errors were temporary.
     */
    readonly canSubmit: boolean

    /**
     * Has the form been changed from its initial value?
     */
    readonly isDirty: boolean
    /**
     * Has the form been changed from its last submitted value?
     */
    readonly isDirtySinceSubmitted: boolean

    /**
     * True if the form is focused.
     */
    readonly isFocused: boolean
    /**
     * True if the form is blurred.
     */
    readonly isBlurred: boolean

    /**
     * True if the form is currently validating.
     */
    readonly isValidating: boolean
    /**
     * True if the form is currently submitting.
     */
    readonly isSubmitting: boolean

}
