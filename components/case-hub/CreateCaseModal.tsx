'use client';

import { useState } from 'react';
import { Modal, Button, Select } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { PassportInfoCard } from './PassportInfoCard';
import { Globe, Hash, User, FileText } from 'lucide-react';
import { VISA_TYPES } from '@/data/constants';
import { MOCK_USERS } from '@/data/users';
import type { PassportInfo, VisaType } from '@/types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCaseData) => void;
}

interface CreateCaseData {
  visaType: VisaType;
  referenceNumber: string;
  advisorId: string;
  assistantId?: string;
  passport: PassportInfo;
}

// Mock passport data for demo
const MOCK_PASSPORT: PassportInfo = {
  givenNames: 'Bob',
  surname: 'Brown',
  nationality: 'British',
  countryOfBirth: 'France',
  dateOfBirth: '1990-01-23',
  sex: 'M',
  dateOfIssue: '2021-01-23',
  dateOfExpiry: '2026-01-23',
  passportNumber: 'AT38249065',
  mrzLine1: 'P<GRCKOUTSAIMANI<<ELENI<<<<<<<<<<<<<<<<<<<<<',
  mrzLine2: 'AT38249065GRC8109149F2611309<<<<<<<<<<<<<<06',
};

export function CreateCaseModal({ isOpen, onClose, onSubmit }: CreateCaseModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [passportData, setPassportData] = useState<PassportInfo | null>(null);
  const [formData, setFormData] = useState({
    visaType: '' as VisaType | '',
    referenceNumber: '',
    advisorId: MOCK_USERS[0].id,
    assistantId: '',
  });

  const visaOptions = Object.entries(VISA_TYPES).map(([value, config]) => ({
    value,
    label: config.label,
    description: config.description,
  }));

  const userOptions = MOCK_USERS.filter(u => u.role !== 'applicant').map(u => ({
    value: u.id,
    label: u.name,
  }));

  const handleUpload = async () => {
    if (passportData || isUploading) return;
    setIsUploading(true);
    // Simulate AI extraction
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPassportData(MOCK_PASSPORT);
    setIsUploading(false);
  };

  const handleSubmit = () => {
    onSubmit({
      visaType: formData.visaType as VisaType,
      referenceNumber: formData.referenceNumber,
      advisorId: formData.advisorId,
      assistantId: formData.assistantId || undefined,
      passport: passportData || MOCK_PASSPORT,
    });
    handleClose();
  };

  const handleClose = () => {
    setPassportData(null);
    setIsUploading(false);
    setFormData({
      visaType: '',
      referenceNumber: '',
      advisorId: MOCK_USERS[0].id,
      assistantId: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Application"
      size="lg"
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0E4369] hover:bg-[#0B3654] rounded-lg transition-colors"
          >
            Create Application
          </button>
        </>
      }
    >
      <div className="py-4 space-y-6">
        {/* Passport Upload Zone or Info */}
        {passportData ? (
          <PassportInfoCard passport={passportData} />
        ) : (
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#0E4369]/50 hover:bg-[#0E4369]/5 transition-all cursor-pointer"
            onClick={handleUpload}
          >
            <div className="w-12 h-12 bg-[#0E4369]/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-[#0E4369] border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileText className="w-6 h-6 text-[#0E4369]" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isUploading ? 'Analyzing passport...' : 'Upload passport (optional)'}
            </p>
            <p className="text-xs text-gray-400">
              Click to browse or drag and drop
            </p>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <Select
            label="Visa type"
            placeholder="Select a visa type or you can decide later"
            options={visaOptions}
            value={formData.visaType}
            onChange={(value) => setFormData({ ...formData, visaType: value as VisaType })}
            leftIcon={<Globe className="w-4 h-4" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reference number
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Enter application reference"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Advisor"
              options={userOptions}
              value={formData.advisorId}
              onChange={(value) => setFormData({ ...formData, advisorId: value })}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Select
              label="Assistant"
              placeholder="None"
              options={[{ value: '', label: 'None' }, ...userOptions]}
              value={formData.assistantId}
              onChange={(value) => setFormData({ ...formData, assistantId: value })}
              leftIcon={<User className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
