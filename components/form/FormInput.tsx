import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface Props {
  inputId: string
  label?: string
  inputType: string
  defaultValue?: string
  placeholder?: string
}

function FormInput({ inputId, label, inputType, defaultValue, placeholder }: Props) {
  return (
    <div className='mb-2'>
      <Label
        htmlFor={inputId}
        className='capitalize'
      >
        {label || inputId}
      </Label>
      <Input
        id={inputId}
        name={inputId}
        type={inputType}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
      />
    </div>
  )
}

export default FormInput
