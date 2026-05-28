import { Minus, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
};

export const FontSizeInput = ({
  value,
  onChange,
}: FontSizeInputProps) => {

  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    onChange(value);
  }

  return (
    <div className="flex items-center inline-flex bg-background rounded-lg border border-border overflow-hidden">
      <Button
        onClick={decrement}
        variant="ghost"
        className="h-8 w-8 rounded-none border-none p-0 hover:bg-muted"
        size="icon"
      >
        <Minus className="size-4" />
      </Button>

      <Input
        onChange={handleChange}
        value={value}
        type="number"
        className="w-[50px] h-8 rounded-none border-y-0 border-x border-border bg-transparent text-center focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <Button
        onClick={increment}
        variant="ghost"
        className="h-8 w-8 rounded-none border-none p-0 hover:bg-muted"
        size="icon"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}