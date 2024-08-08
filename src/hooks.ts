import { isNotNil } from "ramda"
import { FormState } from "./state"
import { useDeepCompareEffect } from "./util"

export const FORM_HOOKS = {

    blur: <T>(context: FormState<T>) => context.lastBlurred,
    change: <T>(context: FormState<T>) => context.lastChanged,
    commit: <T>(context: FormState<T>) => context.lastCommitted,
    focus: <T>(context: FormState<T>) => context.lastFocused,
    init: <T>(context: FormState<T>) => context.lastInitialized,
    afterSubmit: <T>(context: FormState<T>) => context.lastSubmitted,
    beforeSubmit: <T>(context: FormState<T>) => context.lastSubmitRequested,
    afterValidate: <T>(context: FormState<T>) => context.lastValidated,
    beforeValidate: <T>(context: FormState<T>) => context.lastValidateRequested,

} as const

export const FORM_HOOK_KEYS = Object.keys(FORM_HOOKS) as FormHook[]

/**
 * An event type for the form.
 */
export type FormHook = keyof typeof FORM_HOOKS

/**
 * Attach a callback to a form hook.
 * @param form The form.
 * @param hooks Which hook to trigger on.
 * @param callback The callback to run.
 */
export function useFormHook<T>(form: FormState<T>, hooks: FormHook | readonly FormHook[], action: () => void) {
    const value = [hooks].flat().map(hook => FORM_HOOKS[hook](form)).filter(isNotNil)
    useDeepCompareEffect(() => {
        if (value.length > 0) {
            action()
        }
    }, [
        hooks,
        value
    ])
}
