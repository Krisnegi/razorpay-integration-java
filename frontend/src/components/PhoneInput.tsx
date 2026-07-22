'use client';

import React, { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';

export interface CountryCodeOption {
  code: string;
  flag: string;
  name: string;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
];

interface PhoneInputProps {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  label?: string;
  required?: boolean;
  error?: string | null;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  label = 'Phone Number',
  required = false,
  error,
}) => {
  const [touched, setTouched] = useState(false);

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict input to digits only
    const digitsOnly = e.target.value.replace(/\D/g, '');
    onPhoneChange(digitsOnly);
  };

  // Dynamic Validation Rules
  const isValidPhone = () => {
    if (!phone) return !required;
    // Check length (7 to 15 digits)
    return phone.length >= 7 && phone.length <= 15;
  };

  const hasValidationError = (touched || error) && !isValidPhone();

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
        {label} {required ? <span className="text-rose-400">*</span> : <span className="text-slate-500 font-normal lowercase">(optional)</span>}
      </label>

      <div className="relative flex items-center gap-1.5">
        {/* Country Code Select Dropdown */}
        <div className="relative shrink-0">
          <select
            value={countryCode || '+91'}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-500 pr-7 cursor-pointer"
          >
            {COUNTRY_CODES.map((c, idx) => (
              <option key={`${c.code}-${idx}`} value={c.code} className="bg-slate-900 text-white">
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Phone Input Field */}
        <div className="relative flex-1">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="tel font-mono"
            value={phone}
            onBlur={() => setTouched(true)}
            onChange={handlePhoneInputChange}
            placeholder={countryCode === '+91' ? '9876543210' : '1234567890'}
            className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white focus:outline-none transition-all ${
              hasValidationError
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>
      </div>

      {/* Validation Error Message */}
      {hasValidationError && (
        <div className="flex items-center gap-1 mt-1 text-[11px] text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Please enter a valid phone number (7 to 15 digits)</span>
        </div>
      )}
      {error && !hasValidationError && (
        <div className="flex items-center gap-1 mt-1 text-[11px] text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
