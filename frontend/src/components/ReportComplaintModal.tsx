import React, { useEffect, useState } from 'react';
import type { Category, Complaint } from '../types';
import { complaintApi } from '../services/api';
import { LocationPickerMap } from './LocationPickerMap';
import { X, Upload, AlertCircle, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onComplaintCreated: (complaint: Complaint) => void;
}

export const ReportComplaintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  onComplaintCreated,
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  if (!isOpen) return null;

  const closeForm = () => {
    if (submitting) return;
    setTitle('');
    setCategoryId('');
    setDescription('');
    setAddress('');
    setLatitude(undefined);
    setLongitude(undefined);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setFieldErrors({});
    setCreatedComplaint(null);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file.type.startsWith('image/')) {
        setError('Choose an image file to attach.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('The image must be 10 MB or smaller.');
        return;
      }
      setError(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategoryId = categoryId || categories[0]?.id;
    const nextErrors = {
      title: title.trim() ? '' : 'Enter a short title for the problem.',
      categoryId: selectedCategoryId ? '' : 'Choose a problem category.',
      address: address.trim() ? '' : 'Enter an address or nearby landmark.',
      description: description.trim() ? '' : 'Describe what needs attention.',
    };
    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setError('Review the highlighted required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', selectedCategoryId.toString());
      formData.append('address', address);
      if (latitude !== undefined && longitude !== undefined) {
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());
      }
      if (imageFile) formData.append('image', imageFile);

      const created = await complaintApi.create(formData);
      onComplaintCreated(created);
      setCreatedComplaint(created);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lodge complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="civic-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
      <div className="civic-modal relative my-6 max-w-2xl" role="dialog" aria-modal="true" aria-labelledby="report-dialog-title">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 id="report-dialog-title" className="text-lg font-bold text-slate-900">Report a problem</h2>
            <p className="text-sm text-slate-500 mt-0.5">Share what happened and where municipal teams can find it.</p>
          </div>
          <button
            onClick={closeForm}
            aria-label="Close report form"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {createdComplaint ? (
          <div className="p-7 sm:p-9 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700"><Check className="h-6 w-6" /></div>
            <p className="civic-eyebrow mt-4">Report received</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Your complaint has been recorded</h3>
            <p className="mt-2 text-sm text-slate-600">Save this reference number to find your report in My complaints.</p>
            <p className="mt-4 inline-block rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-semibold text-slate-900">{createdComplaint.complaintNumber}</p>
            <div className="mt-6"><button type="button" onClick={closeForm} className="civic-primary-button">View my complaints</button></div>
          </div>
        ) : <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="report-title" className="block text-sm font-medium text-slate-700 mb-1">
              Problem title <span className="text-red-700" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="report-title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setFieldErrors((current) => ({ ...current, title: '' })); }}
              placeholder="e.g. Hazardous pothole at junction"
              className="civic-input w-full"
            />
            {fieldErrors.title && <p className="mt-1 text-xs text-red-700">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="report-category" className="block text-sm font-medium text-slate-700 mb-1">
                Category <span className="text-red-700" aria-hidden="true">*</span>
              </label>
              <select
                required
                id="report-category"
                value={categoryId || categories[0]?.id || ''}
                onChange={(e) => { setCategoryId(Number(e.target.value)); setFieldErrors((current) => ({ ...current, categoryId: '' })); }}
                className="civic-input w-full"
              >
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="report-address" className="block text-sm font-medium text-slate-700 mb-1">
                Address or landmark <span className="text-red-700" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="report-address"
                required
                maxLength={500}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setFieldErrors((current) => ({ ...current, address: '' })); }}
                placeholder="e.g. 14th Main Road, Sector 3"
                className="civic-input w-full"
              />
              {fieldErrors.categoryId && <p className="mt-1 text-xs text-red-700">{fieldErrors.categoryId}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="report-description" className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-red-700" aria-hidden="true">*</span>
            </label>
            <textarea
              required
              id="report-description"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setFieldErrors((current) => ({ ...current, description: '' })); }}
              placeholder="Describe the problem, approximate severity, and any immediate hazard..."
              className="civic-input w-full"
            />
              {fieldErrors.address && <p className="mt-1 text-xs text-red-700">{fieldErrors.address}</p>}
            <div className="mt-1 text-right text-[11px] text-slate-500">{description.length}/2000</div>
          </div>

          {/* Map Location Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Pin Location on Map
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {latitude !== undefined && longitude !== undefined ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'Optional · no point selected'}
              </span>
            </div>
            <LocationPickerMap
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
            {fieldErrors.description && <p className="mt-1 text-xs text-red-700">{fieldErrors.description}</p>}
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Attach Photo Proof (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Select Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  aria-label="Choose an optional image attachment"
                />
              </label>
              {imageFile && (
                <span className="text-xs text-slate-600 truncate max-w-xs font-medium">
                  {imageFile.name}
                </span>
              )}
            </div>

            {imagePreview && (
              <div className="mt-2 relative w-28 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  aria-label="Remove attached image"
                  className="absolute top-1 right-1 p-0.5 rounded bg-slate-900/80 text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Grievance'}</span>
            </button>
          </div>
        </form>}
      </div>
    </div>
  );
};
