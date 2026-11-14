import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { hackathonApi, getErrorMessage } from '../services/api.js';
import {
  fullNameRules,
  mobileRules,
  urlRules,
  emailRules,
  validateTeamMembers,
} from '../utils/validators.js';
import FormField from '../components/FormField.jsx';
import Spinner, { PageLoader } from '../components/Spinner.jsx';

const SELECT_FIELDS = [
  { name: 'collegeName', label: 'College name', optionsKey: 'COLLEGES' },
  { name: 'course', label: 'Course', optionsKey: 'COURSES' },
  { name: 'branch', label: 'Branch', optionsKey: 'BRANCHES' },
  { name: 'yearOfStudy', label: 'Year of study', optionsKey: 'YEARS_OF_STUDY' },
  { name: 'domain', label: 'Domain / track', optionsKey: 'DOMAINS' },
];

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      mobileNumber: '',
      collegeName: '',
      course: '',
      branch: '',
      yearOfStudy: '',
      domain: '',
      projectName: '',
      pptLink: '',
      prototypeLink: '',
      demoVideoLink: '',
      teamSize: '1',
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'teamMembers' });
  const teamSize = Number(watch('teamSize') || 1);

  // Load dropdown options. Users who already registered go straight to the dashboard.
  useEffect(() => {
    let active = true;
    const existingEntry = hackathonApi.myEntry().catch((err) => {
      if (err.response?.status === 404) return null;
      throw err;
    });

    Promise.all([hackathonApi.options(), existingEntry])
      .then(([opts, entry]) => {
        if (!active) return;
        if (entry) {
          toast('You have already registered.');
          navigate('/dashboard', { replace: true });
          return;
        }
        setOptions(opts);
      })
      .catch((err) => toast.error(getErrorMessage(err)));

    return () => {
      active = false;
    };
  }, [navigate]);

  // Keep exactly (teamSize - 1) member blocks. Existing typed values are kept.
  useEffect(() => {
    const needed = Math.max(teamSize - 1, 0);
    const current = fields.length;
    for (let i = current; i < needed; i++) append({ fullName: '', email: '' });
    for (let i = current; i > needed; i--) remove(i - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSize]);

  const onSubmit = async (values) => {
    const memberError = validateTeamMembers(values.teamMembers, user.email);
    if (memberError) return toast.error(memberError);

    const payload = {
      ...values,
      email: undefined,
      teamSize: Number(values.teamSize),
      teamMembers: values.teamMembers.map((m) => ({ fullName: m.fullName.trim(), email: m.email.trim() })),
    };

    try {
      const res = await hackathonApi.register(payload);
      toast.success('Registration submitted!');
      navigate('/register/success', { state: { registration: res.data } });
    } catch (err) {
      if (err.response?.status === 409) {
        toast('You have already registered.');
        navigate('/dashboard', { replace: true });
        return;
      }
      err.response?.data?.errors?.forEach((e) => {
        if (e.field && !e.field.startsWith('teamMembers')) setError(e.field, { message: e.message });
      });
      toast.error(getErrorMessage(err));
    }
  };

  if (!options) return <PageLoader />;

  const fieldError = (name) => errors[name]?.message;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium text-brand-cyan">Hackathon registration</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Register your team</h1>
        <p className="mt-2 text-slate-400">All fields are required unless marked optional.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-8">
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-2 text-lg font-semibold text-white">Participant details</legend>

          <FormField id="fullName" label="Full name" error={fieldError('fullName')}>
            <input id="fullName" className="input" {...register('fullName', fullNameRules)} />
          </FormField>

          <FormField id="email" label="Email address">
            <input id="email" className="input opacity-70" readOnly {...register('email', emailRules)} />
          </FormField>

          <FormField id="mobileNumber" label="Mobile number" error={fieldError('mobileNumber')}>
            <input id="mobileNumber" inputMode="numeric" placeholder="10-digit mobile number" className="input" {...register('mobileNumber', mobileRules)} />
          </FormField>

          {SELECT_FIELDS.map((f) => (
            <FormField key={f.name} id={f.name} label={f.label} error={fieldError(f.name)}>
              <select id={f.name} className="input" {...register(f.name, { required: `Select ${f.label.toLowerCase()}` })}>
                <option value="">Select</option>
                {options[f.optionsKey].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FormField>
          ))}
        </fieldset>

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-2 text-lg font-semibold text-white">Project details</legend>

          <FormField id="projectName" label="Project name" error={fieldError('projectName')}>
            <input id="projectName" className="input" {...register('projectName', { required: 'Project name is required', minLength: { value: 5, message: 'At least 5 characters' } })} />
          </FormField>

          <FormField id="teamSize" label="Team size" error={fieldError('teamSize')}>
            <select id="teamSize" className="input" {...register('teamSize')}>
              {Array.from({ length: options.TEAM_SIZE_MAX }, (_, i) => i + options.TEAM_SIZE_MIN).map((n) => (
                <option key={n} value={n}>{n === 1 ? '1 (solo)' : n}</option>
              ))}
            </select>
          </FormField>

          <FormField id="pptLink" label="PPT link (Google Drive / OneDrive)" error={fieldError('pptLink')}>
            <input id="pptLink" type="url" placeholder="https://" className="input" {...register('pptLink', urlRules('PPT link'))} />
          </FormField>

          <FormField id="prototypeLink" label="Prototype link (GitHub / Figma / live demo)" error={fieldError('prototypeLink')}>
            <input id="prototypeLink" type="url" placeholder="https://" className="input" {...register('prototypeLink', urlRules('Prototype link'))} />
          </FormField>

          <div className="sm:col-span-2">
            <FormField id="demoVideoLink" label="Demo video link (optional)" error={fieldError('demoVideoLink')}>
              <input
                id="demoVideoLink"
                type="url"
                placeholder="https://"
                className="input"
                {...register('demoVideoLink', { pattern: { value: /^(https?:\/\/[^\s]+)?$/i, message: 'Enter a valid http or https link' } })}
              />
            </FormField>
          </div>
        </fieldset>

        {fields.length > 0 && (
          <fieldset className="space-y-4">
            <legend className="mb-2 text-lg font-semibold text-white">Team members</legend>
            {fields.map((field, i) => (
              <div key={field.id} className="grid gap-4 rounded-xl border border-white/10 p-4 sm:grid-cols-2">
                <p className="text-sm font-medium text-slate-400 sm:col-span-2">Member {i + 1}</p>
                <input
                  aria-label={`Member ${i + 1} full name`}
                  placeholder="Full name"
                  className="input"
                  {...register(`teamMembers.${i}.fullName`, { required: 'Required', minLength: { value: 3, message: 'At least 3 characters' } })}
                />
                <input
                  aria-label={`Member ${i + 1} email`}
                  type="email"
                  placeholder="Email"
                  className="input"
                  {...register(`teamMembers.${i}.email`, emailRules)}
                />
              </div>
            ))}
          </fieldset>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            Submit registration
          </button>
        </div>
      </form>
    </section>
  );
}
