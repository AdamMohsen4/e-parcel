
import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoadScript } from '@react-google-maps/api';

// Libraries to load from Google Maps API
const libraries = ['places'];

interface GooglePlacesAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect: (address: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}

const GooglePlacesAutocomplete = ({ 
  onPlaceSelect, 
  className, 
  label, 
  placeholder = "Enter address",
  ...props 
}: GooglePlacesAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(props.value || '');
  
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB1DNXVI2S-kUTK02E6bLrnFOl-k7e8jkM',
    libraries: libraries as any,
  });

  // Initialize autocomplete when the script is loaded
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address'],
    });

    // Listen for place changes
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setInputValue(place.formatted_address);
        onPlaceSelect(place.formatted_address);
      }
    });

    // Cleanup
    return () => {
      // Remove event listeners 
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, onPlaceSelect]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    // Fallback to regular input if Maps API fails to load
    return (
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={isLoaded ? placeholder : "Loading..."}
      className={cn(className)}
      disabled={!isLoaded}
      {...props}
    />
  );
};

export default GooglePlacesAutocomplete;
