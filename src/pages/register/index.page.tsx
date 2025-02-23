import { useRouter } from 'next/router'
import Logo from '@/../public/icon.svg'
import LogoTextLight from '@/../public/kanban.svg'
import LogoTextDark from '@/../public/kanban-dark.svg'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleApiError } from '@/utils/handleApiError'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import {
  CreateAccountContainer,
  FormContainer,
  FormField,
  IconWrapper,
  InputContainer,
  InputField,
  InputsContainer,
  LayoutContainer,
  LoginCard,
  LogoWrapper,
  TitleContainer,
} from '../login/styles'
import { Envelope, LockKey } from 'phosphor-react'
import { Button } from '@/components/Shared/Button'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useTheme } from 'styled-components'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { NextSeo } from 'next-seo'

const signInFormSchema = z.object({
  name: z.string().min(3, { message: 'Name is required.' }),
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const { enableDarkMode } = useTheme()

  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const [isLoading, setIsLoading] = useState(false)
  console.log(enableDarkMode)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignInFormData) {
    setIsLoading(true)

    try {
      const response = await api.post('/profile', {
        email: data.email,
        password: data.password,
        name: data.name,
      })

      toast.success(response.data.message)

      const signInResponse = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResponse?.error) {
        toast.error('Error logging in automatically. Please log in manually.')
      } else {
        toast.success('Welcome to the Kanban App!')
        router.push('/')
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <NextSeo title="Kanban App | Register" />
      <LayoutContainer>
        <LogoWrapper>
          <Image src={Logo} width={24} height={24} alt="" />
          <Image
            src={
              enableDarkMode === undefined || enableDarkMode
                ? LogoTextLight
                : LogoTextDark
            }
            width={112}
            height={24}
            alt=""
          />
        </LogoWrapper>
        <LoginCard>
          <TitleContainer>
            <h1>Create account</h1>
            <p>Let’s get you started organizing your tasks!</p>
          </TitleContainer>

          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <InputsContainer>
              <FormField>
                <p>Name:</p>
                <InputContainer>
                  <IconWrapper>
                    <LockKey size={16} />
                  </IconWrapper>
                  <InputField
                    type="text"
                    placeholder="e.g. Jon Doe"
                    {...register('name')}
                  />
                </InputContainer>
                {errors?.name && <ErrorMessage message={errors.name.message} />}
              </FormField>

              <FormField>
                <p>E-mail:</p>
                <InputContainer>
                  <IconWrapper>
                    <Envelope size={16} />
                  </IconWrapper>
                  <InputField
                    type="email"
                    placeholder="e.g. jondoe@gmail.com"
                    {...register('email')}
                  />
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
                  <InputField
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                </InputContainer>
                {errors?.password && (
                  <ErrorMessage message={errors.password.message} />
                )}
              </FormField>
            </InputsContainer>

            <Button
              isBigger
              disabled={isSubmitting || isLoading}
              title="Sign Up"
            />

            <CreateAccountContainer>
              <p>Already have an account?</p>
              <Link href="/login">Login</Link>
            </CreateAccountContainer>
          </FormContainer>
        </LoginCard>

        {(isLoading || isRouteLoading) && <LoadingComponent />}
      </LayoutContainer>
    </>
  )
}
