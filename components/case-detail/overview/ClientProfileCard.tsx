"use client";

import {
  User,
  Fingerprint,
  MapPin,
  Calendar,
  Globe2,
  BadgeCheck,
} from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ClientProfileCard() {
  const clientProfile = useCaseDetailStore((state) => state.clientProfile);
  const { passport, contactInfo, completeness } = clientProfile;

  const isEmpty = !passport;

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait">
        {isEmpty ? (
          // Empty State
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "rounded-xl p-5 h-full min-h-[240px] transition-all duration-300",
              "border-2 border-dashed border-gray-200 bg-gray-50",
              "flex flex-col items-center justify-center",
            )}
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <User className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-700 mb-1">
              Client Profile
            </h3>
            <p className="text-xs text-gray-500 text-center max-w-[180px]">
              Upload passport to auto-fill client information
            </p>
          </motion.div>
        ) : (
          // Filled State - Skeuomorphic Passport Card
          <motion.div
            key="filled"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 15 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative h-full"
          >
            {/* Passport Book Effect */}
            <div className="relative overflow-hidden rounded-xl shadow-xl h-full">
              {/* Passport Cover Texture */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              {/* Main Passport Card - Using brand color #0E4268 */}
              <div
                className="relative p-4 h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #0E4268 0%, #0a3555 50%, #082a45 100%)",
                }}
              >
                {/* Gold Emblem */}
                <div className="absolute top-3 right-3 w-12 h-12 opacity-25">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-amber-400"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <path
                      d="M50 15 L55 35 L75 35 L60 48 L65 68 L50 55 L35 68 L40 48 L25 35 L45 35 Z"
                      fill="currentColor"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <BadgeCheck className="w-3 h-3 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.15em] text-amber-400/80 uppercase">
                        Verified Profile
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completeness}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-[10px] text-amber-400/80">
                      {completeness}%
                    </span>
                  </div>
                </div>

                {/* Passport Photo + Info Area */}
                <div className="flex gap-4">
                  {/* Photo Placeholder */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-20 rounded bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden shadow-inner border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gray-400/50 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Full Name */}
                    <div>
                      <p className="text-[9px] tracking-wider text-white/40 uppercase">
                        Full Name
                      </p>
                      <p className="text-base font-semibold text-white tracking-wide truncate">
                        {passport.givenNames} {passport.surname}
                      </p>
                    </div>

                    {/* Nationality + Passport Number */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] tracking-wider text-white/40 uppercase">
                          Nationality
                        </p>
                        <div className="flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-amber-400/70" />
                          <p className="text-xs text-white/90 truncate">
                            {passport.nationality}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-wider text-white/40 uppercase">
                          Passport No.
                        </p>
                        <div className="flex items-center gap-1">
                          <Fingerprint className="w-3 h-3 text-amber-400/70" />
                          <p className="text-xs text-white/90 font-mono truncate">
                            {passport.passportNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DOB + Place of Birth */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] tracking-wider text-white/40 uppercase">
                          Date of Birth
                        </p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400/70" />
                          <p className="text-xs text-white/90">
                            {passport.dateOfBirth}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-wider text-white/40 uppercase">
                          Sex
                        </p>
                        <p className="text-xs text-white/90">
                          {passport.sex === "M"
                            ? "Male"
                            : passport.sex === "F"
                              ? "Female"
                              : "Other"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MRZ Zone (Machine Readable Zone) - Compact */}
                <div className="mt-3 pt-2 border-t border-white/10">
                  <div className="bg-black/30 rounded px-2 py-1.5 font-mono text-[9px] text-white/50 tracking-[0.1em] leading-relaxed overflow-hidden">
                    <p className="truncate">
                      P&lt;
                      {passport.nationality?.slice(0, 3).toUpperCase() || "XXX"}
                      &lt;&lt;
                      {passport.surname?.toUpperCase().replace(/\s/g, "<") ||
                        "SURNAME"}
                      &lt;&lt;
                      {passport.givenNames?.toUpperCase().replace(/\s/g, "<") ||
                        "GIVEN"}
                    </p>
                  </div>
                </div>

                {/* Contact Info (if available) - Compact */}
                {contactInfo && (contactInfo.email || contactInfo.phone) && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex gap-2">
                    {contactInfo.email && (
                      <div className="flex-1 flex items-center gap-1.5 bg-white/5 rounded px-2 py-1">
                        <svg
                          className="w-2.5 h-2.5 text-amber-400/70 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[10px] text-white/70 truncate">
                          {contactInfo.email}
                        </span>
                      </div>
                    )}
                    {contactInfo.phone && (
                      <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1">
                        <svg
                          className="w-2.5 h-2.5 text-amber-400/70 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-[10px] text-white/70">
                          {contactInfo.phone}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Spine Effect (left edge) */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/30 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
