'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Rocket } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createJob } from '@/lib/actions/jobs';
import {
  jobCategories,
  jobTypes,
  salaryFrequencies,
} from '@/lib/constants/jobs';
import type { JobFormData } from '@/lib/types/jobs';

const inputClass =
  'h-10 w-full rounded-xl border-white/10 bg-white/[0.04] text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-zinc-300';
const cardClass = 'rounded-2xl border border-white/10 bg-white/[0.03] p-6';

// auth-form.tsx-এর হুবহু collect প্যাটার্ন — flat state অবজেক্ট, name দিয়ে generic update
const emptyJob: JobFormData = {
  title: '',
  company: '',
  category: '',
  // value গুলো label-ই — SelectValue সরাসরি দেখাতে পারে, কোনো mapping লাগে না
  jobType: 'Full-Time',
  remoteAllowed: false,
  location: '',
  deadline: '',
  salaryMin: '',
  salaryMax: '',
  frequency: 'per hour',
  responsibilities: '',
  requirements: '',
};

// numbered সেকশন হেডার — স্ক্রিনশটের ভায়োলেট ব্যাজ + টাইটেল প্যাটার্ন
function SectionHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-6 items-center justify-center rounded-md border border-indigo-400/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300">
        {step}
      </span>
      <h2 className="text-base font-semibold tracking-tight text-white">
        {title}
      </h2>
    </div>
  );
}

export default function NewJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<JobFormData>(emptyJob);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Select-এর জন্য generic হ্যান্ডলার — শুধু name পাঠিয়ে দিলেই কাজ শেষ
  const handleSelect =
    (name: 'category' | 'frequency') => (value: string | null) => {
      if (!value) return;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // TODO: এখানে Mongo/API কল যোগ হবে — আপাতত data collect হয়ে console-এ আসছে
      console.log('new job data', formData);
      router.push('/dashboard/recruiter/jobs');
    } finally {
      setIsSubmitting(false);
    }

    //

    const result = await createJob(formData);
    console.log('createJob result:', result);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* হেডার: overline + টাইটেল + ডানপাশে Publish Job */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Create New Listing
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Post a New Job
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>
        <Button
          type="submit"
          form="new-job-form"
          disabled={isSubmitting}
          className="h-10 gap-2 rounded-xl bg-indigo-500 px-5 text-sm text-white hover:bg-indigo-400"
        >
          <Rocket className="size-4" />
          {isSubmitting ? 'Publishing…' : 'Publish Job'}
        </Button>
      </header>

      <form
        id="new-job-form"
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        {/* সেকশন ১ — Basic Information */}
        <section className={cardClass}>
          <SectionHeader step={1} title="Basic Information" />

          <div className="mt-5 space-y-5">
            <div>
              <Label htmlFor="title" className={labelClass}>
                Job title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Senior Product Designer"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="company" className={labelClass}>
                  Company name
                </Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className={labelClass}>
                  Job Category
                </Label>
                <Select
                  value={formData.category || null}
                  onValueChange={handleSelect('category')}
                >
                  <SelectTrigger id="category" className={inputClass}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job type — segmented chips */}
            <div>
              <Label className={labelClass}>Job type</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {jobTypes.map(type => {
                  const isSelected = formData.jobType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setFormData(prev => ({ ...prev, jobType: type }))
                      }
                      className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-500 text-white hover:bg-indigo-400'
                          : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* সেকশন ২ — Location, Compensation & Timeline */}
        <section className={cardClass}>
          <SectionHeader step={2} title="Location, Compensation & Timeline" />

          <div className="mt-5 space-y-5">
            {/* Remote toggle — ভেতরের বর্ডার্ড রো */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Remote work allowed
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
              <Switch
                checked={formData.remoteAllowed}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, remoteAllowed: checked }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="location" className={labelClass}>
                  Job location <span className="text-zinc-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. New York, USA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <span className="mt-1 block text-xs text-zinc-500">
                  Required
                </span>
              </div>

              <div>
                <Label htmlFor="deadline" className={labelClass}>
                  Application deadline
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="salaryMin" className={labelClass}>
                  Min salary / rate
                </Label>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  min="0"
                  placeholder="25"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <Label htmlFor="salaryMax" className={labelClass}>
                  Max salary / rate
                </Label>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  min="0"
                  placeholder="40"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <Label htmlFor="frequency" className={labelClass}>
                  Frequency
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={handleSelect('frequency')}
                >
                  <SelectTrigger id="frequency" className={inputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryFrequencies.map(frequency => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* সেকশন ৩ — Responsibilities & Requirements */}
        <section className={cardClass}>
          <SectionHeader step={3} title="Responsibilities & Requirements" />

          <div className="mt-5 space-y-5">
            <div>
              <Label htmlFor="responsibilities" className={labelClass}>
                Key responsibilities
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="Describe the key responsibilities of the role…"
                rows={4}
                value={formData.responsibilities}
                onChange={handleChange}
                className="rounded-xl border-white/10 bg-white/[0.04] text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="requirements" className={labelClass}>
                Qualifications &amp; requirements
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder={'• 3+ years of experience with…'}
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                className="rounded-xl border-white/10 bg-white/[0.04] text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/20"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
