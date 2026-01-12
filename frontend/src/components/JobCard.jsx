
import React from 'react';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const formattedDate = new Date(job.postedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-green-100"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{job.jobRole}</h3>
        <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
          <Calendar size={10} className="mr-1" />
          {formattedDate}
        </span>
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-1">
        <MapPin size={14} className="mr-1.5 text-green-500" />
        <span>{job.city}</span>
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <Briefcase size={14} className="mr-1.5 text-gray-400" />
        <span>Posted by: {job.fullName}</span>
      </div>

      <div className="border-t border-gray-50 pt-3 flex justify-end">
        <span className="text-green-600 text-xs font-semibold flex items-center">
          View Details
          <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default JobCard;
