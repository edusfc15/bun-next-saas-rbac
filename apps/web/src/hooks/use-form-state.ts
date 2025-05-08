import { signInWithEmailAndPassword } from "@/app/auth/sign-in/actions"
import { FormEvent, startTransition, useState, useTransition } from "react"

interface FormState {
    success: boolean
    message: string | null
    errors: Record<string, string[]> | null
}

export function useFormState(
    action: (data: FormData) => Promise<FormState>,
    initialState?: FormState
) {
    const [isPending, startTransition] = useTransition()
    
    const [formState, setFormState] = useState(initialState ?? {
        success: false,
        message: null,
        errors: null,
    })

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = event.currentTarget
        const data = new FormData(formData)

        startTransition(async () => {
            const state = await action(data)
            setFormState(state)
        })
    }

    return [formState, handleSubmit, isPending] as const
}