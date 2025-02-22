import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Logo from '@/../public/icon.svg';
import LogoTextLight from '@/../public/kanban.svg';
import LogoTextDark from '@/../public/kanban-dark.svg';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleApiError } from '@/utils/handleApiError';
import { notyf } from '@/lib/notyf';
import { ErrorMessage } from '@/components/Shared/ErrorMessage';
import { CreateAccountContainer, FormContainer, FormField, IconWrapper, InputContainer, InputField, InputsContainer, LayoutContainer, LoginCard, LogoWrapper, TitleContainer } from './styles';
import { Envelope, LockKey } from 'phosphor-react';
import { Button } from '@/components/Shared/Button';
import { useBoardsContext } from '@/contexts/BoardsContext';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Circles } from 'react-loader-spinner';  // Importar o loader de exemplo
import { Loader } from '@/styles/shared';

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export default function Login() {
  const {
    enableDarkMode,
  } = useBoardsContext();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: SignInFormData) {
    setLoading(true);

    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response?.error);
      } else {
        toast?.success('Welcome to the Kanban App!');
        router.push('/');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutContainer>
      <LogoWrapper>
        <Image src={Logo} width={24} height={24} alt="" />
        <Image
          src={enableDarkMode ? LogoTextLight : LogoTextDark}
          width={112}
          height={24}
          alt=""
        />
      </LogoWrapper>
      <LoginCard>
        <TitleContainer>
          <h1>Login</h1>
          <p>Add your details below to get back into the app</p>
        </TitleContainer>

        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <InputsContainer>
            <FormField>
              <p>E-mail:</p>
              <InputContainer>
                <IconWrapper>
                  <Envelope size={16} />
                </IconWrapper>
                <InputField type="email" placeholder="e.g. jondoe@gmail.com" {...register('email')} />
              </InputContainer>
              {errors?.email && (
                <ErrorMessage message={errors.email.message} />
              )}
            </FormField>

            <FormField>
              <p>Password:</p>
              <InputContainer>
                <IconWrapper>
                  <LockKey size={16} />
                </IconWrapper>
                <InputField type="password" placeholder="Enter your password" {...register('password')} />
              </InputContainer>
              {errors?.password && (
                <ErrorMessage message={errors.password.message} />
              )}
            </FormField>
          </InputsContainer>

          <Button
            isBigger
            disabled={isSubmitting || loading} // Desabilita o botão enquanto está enviando ou carregando
            title="Login"
          />

          <CreateAccountContainer>
            <p>Don't have an account?</p>
            <Link href="/register">Create account</Link>
          </CreateAccountContainer>
        </FormContainer>
      </LoginCard>

      {loading && (
        <Loader className="overlay">
          <Circles color="#635FC7" height={80} width={80} /> {/* Loader de loading */}
        </Loader>
      )}
    </LayoutContainer>
  );
}
