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
  const [optionsFailed, setOptionsFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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
    setOptions(null);
    setOptionsFailed(false);
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
      .catch((err) => {
        if (!active) return;
        setOptionsFailed(true);
        toast.error(getErrorMessage(err));
      });

    return () => {
      active = false;
    };
  }, [navigate, reloadKey]);

  // Keep exactly (teamSize - 1) member blocks. Existing typed values are kept.
  useEffect(() => {
    const needed = Math.max(teamSize - 1, 0);
    const current = fields.length;
    for (let i = current; i < needed; i += 1) append({ fullName: '', email: '' });
    for (let i = current; i > needed; i -= 1) remove(i - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSize]);

  const onSubmit = async (values) => {
    const memberError = validateTeamMembers(values.teamMembers, user.email);
    if (memberError) return toast.error(memberError);

    const payload = {
      ...values,
      teamSize: Number(values.teamSize),
      teamMembers: values.teamMembers.map((member) => ({
        fullName: member.fullName.trim(),
        email: member.email.trim(),
      })),
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
      err.response?.data?.errors?.forEach((validationError) => {
        if (validationError.field && !validationError.field.startsWith('teamMembers')) {
          setError(validationError.field, { message: validationError.message });
        }
      });
      toast.error(getErrorMessage(err));
    }
  };

  if (!options) {
    if (!optionsFailed) return <PageLoader />;
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Could not load the form</h1>
        <p className="mt-2 text-sm text-slate-400">Please check your connection and try again.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-primary mt-6">
          Try again
        </button>
      </section>
    );
  }

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

          <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
            <input id="fullName" autoComplete="name" className="input" {...register('fullName', fullNameRules)} />
          </FormField>

          <FormField id="email" label="Email address (from your account)">
            <input id="email" type="email" readOnly className="input cursor-not-allowed opacity-70" {...register('email', emailRules)} />
          </FormField>

          <FormField id="mobileNumber" label="Mobile number" error={errors.mobileNumber?.message}>
            <input
              id="mobileNumber"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="10-digit mobile number"
              className="input"
              {...register('mobileNumber', mobileRules)}
            />
          </FormField>

          {SELECT_FIELDS.map((field) => (
            <FormField key={field.name} id={field.name} label={field.label} error={errors[field.name]?.message}>
              <select
                id={field.name}
                className="input"
                {...register(field.name, { required: `Select ${field.label.toLowerCase()}` })}
              >
                <option value="">Select</option>
                {options[field.optionsKey].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </FormField>
          ))}
        </fieldset>

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-2 text-lg font-semibold text-white">Project details</legend>

          <FormField id="projectName" label="Project name" error={errors.projectName?.message}>
            <input
              id="projectName"
              placeholder="At least 5 characters"
              className="input"
              {...register('projectName', {
                required: 'Project name is required',
                minLength: { value: 5, message: 'At least 5 characters' },
              })}
            />
          </FormField>

          <FormField id="teamSize" label="Team size" error={errors.teamSize?.message}>
            <select id="teamSize" className="input" {...register('teamSize')}>
              {Array.from(
                { length: options.TEAM_SIZE_MAX - options.TEAM_SIZE_MIN + 1 },
                (_, index) => index + options.TEAM_SIZE_MIN
              ).map((size) => (
                <option key={size} value={size}>{size === 1 ? '1 (solo)' : size}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Team size includes you. Choosing {teamSize} adds {Math.max(teamSize - 1, 0)} member
              {teamSize - 1 === 1 ? '' : 's'} below.
            </p>
          </FormField>

          <FormField id="pptLink" label="PPT link (Google Drive / OneDrive)" error={errors.pptLink?.message}>
            <input id="pptLink" type="url" placeholder="https://" className="input" {...register('pptLink', urlRules('PPT link'))} />
          </FormField>

          <FormField id="prototypeLink" label="Prototype link (GitHub / Figma / live demo)" error={errors.prototypeLink?.message}>
            <input id="prototypeLink" type="url" placeholder="https://" className="input" {...register('prototypeLink', urlRules('Prototype link'))} />
          </FormField>

          <div className="sm:col-span-2">
            <FormField id="demoVideoLink" label="Demo video link (optional)" error={errors.demoVideoLink?.message}>
              <input
                id="demoVideoLink"
                type="url"
                placeholder="https://"
                className="input"
                {...register('demoVideoLink', {
                  pattern: { value: /^(https?:\/\/[^\s]+)?$/i, message: 'Enter a valid http or https link' },
                })}
              />
            </FormField>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 text-lg font-semibold text-white">Team members</legend>
          {fields.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Solo participant. Select a team size of 2 or more to add member details.
            </p>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 rounded-xl border border-white/10 p-4 sm:grid-cols-2">
                <p className="text-sm font-medium text-slate-400 sm:col-span-2">Member {index + 1}</p>
                <FormField
                  id={`member-${index}-name`}
                  label="Full name"
                  error={errors.teamMembers?.[index]?.fullName?.message}
                >
                  <input
                    id={`member-${index}-name`}
                    placeholder="Full name"
                    className="input"
                    {...register(`teamMembers.${index}.fullName`, {
                      required: 'Required',
                      minLength: { value: 3, message: 'At least 3 characters' },
                    })}
                  />
                </FormField>
                <FormField
                  id={`member-${index}-email`}
                  label="Email"
                  error={errors.teamMembers?.[index]?.email?.message}
                >
                  <input
                    id={`member-${index}-email`}
                    type="email"
                    placeholder="member@example.com"
                    className="input"
                    {...register(`teamMembers.${index}.email`, emailRules)}
                  />
                </FormField>
              </div>
            ))
          )}
        </fieldset>

        <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500 sm:mr-auto">
            A confirmation email is sent to your account email after you submit.
          </p>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            Submit registration
          </button>
        </div>
      </form>
    </section>
  );
}
