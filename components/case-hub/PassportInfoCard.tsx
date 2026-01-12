'use client';

import { User, Calendar, Globe, CreditCard } from 'lucide-react';
import type { PassportInfo } from '@/types';

interface PassportInfoCardProps {
  passport: PassportInfo;
}

export function PassportInfoCard({ passport }: PassportInfoCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#0E4369] to-[#1a5a8a] rounded-xl p-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 opacity-70" />
          <span className="text-sm font-medium opacity-70">Passport Information</span>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          {passport.nationality}
        </span>
      </div>

      {/* Name */}
      <div className="mb-4">
        <p className="text-xs opacity-60 mb-1">Full Name</p>
        <p className="text-xl font-semibold">
          {passport.givenNames} {passport.surname}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs opacity-60 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Date of Birth
          </p>
          <p className="text-sm font-medium">{passport.dateOfBirth}</p>
        </div>
        <div>
          <p className="text-xs opacity-60 mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            Sex
          </p>
          <p className="text-sm font-medium">
            {passport.sex === 'M' ? 'Male' : passport.sex === 'F' ? 'Female' : 'Other'}
          </p>
        </div>
        <div>
          <p className="text-xs opacity-60 mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Country of Birth
          </p>
          <p className="text-sm font-medium">{passport.countryOfBirth}</p>
        </div>
        <div>
          <p className="text-xs opacity-60 mb-1">Passport Number</p>
          <p className="text-sm font-medium font-mono">{passport.passportNumber}</p>
        </div>
      </div>

      {/* Validity */}
      <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-xs">
        <div>
          <span className="opacity-60">Issued: </span>
          <span>{passport.dateOfIssue}</span>
        </div>
        <div>
          <span className="opacity-60">Expires: </span>
          <span>{passport.dateOfExpiry}</span>
        </div>
      </div>
    </div>
  );
}
