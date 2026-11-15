import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactApi, getErrorMessage } from '../services/api.js';
import { emailRules } from '../utils/validators.js';
import { CONTACT_EMAIL } from '../utils/event.js';
import FormField from '../components/FormField.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', email: '', message: '' } });

  const onSubmit = async (values) => {
    try {
      const res = await contactApi.send(values);
      toast.success(res.message);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-white">Contact us</h1>
        <p className="mt-3 text-slate-400">
          Questions about registration, teams or submissions? Send us a message and the Code-a-Nova team will get back to
          you.
        </p>

        <div className="card mt-8 text-sm text-slate-400">
          <p className="text-xs uppercase tracking-wide text-slate-500">Official email</p>
          {CONTACT_EMAIL ? (
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-block text-brand-cyan hover:underline">
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="mt-2 text-slate-300">Use the form to reach the Code-a-Nova team.</p>
          )}
          <p className="mt-4 text-xs text-slate-500">We usually reply within 1-2 working days.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5">
        <FormField id="name" label="Name" error={errors.name?.message}>
          <input
            id="name"
            autoComplete="name"
            maxLength={80}
            className="input"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
          />
        </FormField>

        <FormField id="contactEmail" label="Email" error={errors.email?.message}>
          <input id="contactEmail" type="email" autoComplete="email" className="input" {...register('email', emailRules)} />
        </FormField>

        <FormField id="message" label="Message" error={errors.message?.message}>
          <textarea
            id="message"
            rows={5}
            maxLength={2000}
            className="input resize-none"
            placeholder="Tell us how we can help"
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 10, message: 'At least 10 characters' },
            })}
          />
        </FormField>

        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Send message
        </button>
      </form>
    </section>
  );
}
