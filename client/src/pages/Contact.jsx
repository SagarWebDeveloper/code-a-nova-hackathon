import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactApi, getErrorMessage } from '../services/api.js';
import { emailRules } from '../utils/validators.js';
import FormField from '../components/FormField.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Contact() {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
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
        <p className="mt-3 text-slate-400">Questions about registration, teams or submissions? Send us a message.</p>
        {contactEmail && (
          <p className="mt-6 text-sm text-slate-400">
            Official email:{' '}
            <a href={`mailto:${contactEmail}`} className="text-brand-cyan hover:underline">
              {contactEmail}
            </a>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5">
        <FormField id="name" label="Name" error={errors.name?.message}>
          <input id="name" className="input" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })} />
        </FormField>

        <FormField id="contactEmail" label="Email" error={errors.email?.message}>
          <input id="contactEmail" type="email" className="input" {...register('email', emailRules)} />
        </FormField>

        <FormField id="message" label="Message" error={errors.message?.message}>
          <textarea
            id="message"
            rows={5}
            className="input resize-none"
            {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })}
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
