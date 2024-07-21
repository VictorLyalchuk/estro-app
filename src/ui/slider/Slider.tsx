import React, { useState } from 'react';
import './slider.css'

interface SliderProps {
  max: number;
  onChange?: (value: number) => void;
}

const CustomSlider: React.FC<SliderProps> = ({ max, onChange }) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full flex items-center">
        {/* Slider background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 rounded-lg" />
        {/* Filled part of the slider */}
        <div
          style={{ width: `${(value / max) * 100}%` }}
          className="absolute top-0 left-0 h-2 bg-indigo-500 rounded-lg"
        />
        {/* Unfilled part of the slider */}
        <div
          style={{ width: `${100 - (value / max) * 100}%` }}
          className="absolute top-0 right-0 h-2 bg-gray-300 rounded-lg"
        />
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={handleChange}
          className="relative w-full h-2 bg-transparent cursor-pointer appearance-none slider-thumb"
        />
        {/* Display current value */}
        <div
          className="absolute"
          style={{ left: `${(value / max) * 100}%`, transform: 'translateX(-50%) translateY(-150%)' }}
        >
          <div className="bg-white text-black rounded px-2 py-1 text-sm shadow-md">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSlider;
