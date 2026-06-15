import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimpleSelectProps {
  value: string;
  options: string[];
  onValueChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleSelect({
  value,
  options,
  onValueChange,
  placeholder = "Select",
  className = "h-8 text-xs w-28",
}: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt, i) => (
          <SelectItem key={i} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
