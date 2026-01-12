
import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Job } from '../types';
import { deleteGlobalJob } from '../services/api';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onDeleted: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onDeleted }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    const success = await deleteGlobalJob(job.id, emailInput);
    
    if (success) {
      onDeleted();
      onClose();
    } else {
      setError('Verification failed. Use the email provided during posting.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Job Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 no-scrollbar">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{job.jobRole}</h1>
            <div className="flex items-center text-green-600 font-medium bg-green-50 w-fit px-3 py-1 rounded-lg">
              <MapPin size={16} className="mr-2" />
              {job.city}
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>

            <section className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mr-3 border border-gray-100">
                    <ShieldCheck size={16} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Posted by</div>
                    <div className="font-medium">{job.fullName}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mr-3 border border-gray-100">
                    <Phone size={16} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Phone</div>
                    <a href={`tel:${job.phoneNumber}`} className="font-medium text-green-600">{job.phoneNumber}</a>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mr-3 border border-gray-100">
                    <Mail size={16} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <a href={`mailto:${job.email}`} className="font-medium text-green-600">{job.email}</a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center w-full py-3 text-red-500 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} className="mr-2" />
                Remove Post
              </button>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-top-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start">
                  <AlertCircle className="text-amber-600 mr-3 flex-shrink-0" size={20} />
                  <p className="text-xs text-amber-800 leading-tight">Enter the email used for this post to verify ownership.</p>
                </div>
                <input
                  type="email"
                  placeholder="Verification Email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                />
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                <div className="flex space-x-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl font-bold">Cancel</button>
                  <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-3 text-white bg-red-600 rounded-xl font-bold">Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <a href={`tel:${job.phoneNumber}`} className="w-full bg-green-600 text-white py-4 rounded-xl font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <Phone size={18} className="mr-2" /> CALL NOW
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
