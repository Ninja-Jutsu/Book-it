import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const numbers = ['5', '4', '3', '2', '1']

function RatingInput({ name, labelText }: { name: string; labelText?: string }) {
  return (
    <div className='mb-2 max-w-xs'>
      <Label
        htmlFor={name}
        className='capitalize'
      >
        {labelText || name}
      </Label>
      <Select
        defaultValue={numbers[0]}
        name={name}
        required
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {numbers.map((num) => {
            return (
              <SelectItem
                key={num}
                value={num}
              >
                {num}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default RatingInput
