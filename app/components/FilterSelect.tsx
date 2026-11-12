// লেবেল + Select জোড়া — manage jobs পেজের Status/Category ফিল্টারে ব্যবহৃত
// পেজ থেকে রি-ইউজেবল করে বের করা হয়েছে (স্টাইল caller-ই পাস করে)

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterSelectProps = {
  label: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder: string;
  options: readonly string[];
  triggerClassName?: string;
  labelClassName?: string;
};

export function FilterSelect({
  label,
  value,
  onValueChange,
  placeholder,
  options,
  triggerClassName,
  labelClassName,
}: FilterSelectProps) {
  return (
    <>
      <Label className={labelClassName}>{label}</Label>
      <Select value={value} onValueChange={v => onValueChange(v)}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
