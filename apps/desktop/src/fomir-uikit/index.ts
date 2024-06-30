import { FomirPlugin } from 'fomir'
import { Box } from './fields/Box'
import { Checkbox } from './fields/Checkbox'
import { CheckboxGroup } from './fields/CheckboxGroup'
import { CounterInput } from './fields/CounterInput'
import { Divider } from './fields/Divider'
import { Input } from './fields/Input'
import { LocationInput } from './fields/LocationInput'
import { NumberInput } from './fields/NumberInput'
import { PasswordInput } from './fields/PasswordInput'
import { RadioGroup } from './fields/RadioGroup'
import { Reset } from './fields/Reset'
import { Select } from './fields/Select'
import { Submit } from './fields/Submit'
import { Switch } from './fields/Switch'
import { Textarea } from './fields/Textarea'
import { Form } from './Form'

export { FormField } from './FormField'

export type { FomirUIkitNode } from './fomir-uikit-node'

export const FomirUIkit: FomirPlugin = {
  components: {
    Form,
    Input,
    PasswordInput,
    NumberInput,
    LocationInput,
    CounterInput,
    Checkbox,
    Switch,
    RadioGroup,
    CheckboxGroup,
    Textarea,
    Select,
    Reset,
    Submit,
    Box,
    Divider,
  },
}

export default FomirUIkit
