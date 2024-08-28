'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useFormState } from 'react-dom'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { actionFunction } from '@/utils/types'

const initialState = {
  message: '',
}

export default function FormContainer({ action, children, classes }: { action: actionFunction; children: React.ReactNode, classes?: string }) {
  const [state, formAction] = useFormState(action, initialState)
  const { toast } = useToast()
  useEffect(() => {
    if (state.message) {
      toast({
        description: state.message,
      })
    }
  }, [state])
  return <form className={classes} action={formAction}>{children}</form>
}
