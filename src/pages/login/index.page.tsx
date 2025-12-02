/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
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
  PasswordIconWrapper,
  TitleContainer,
} from './styles'
import { Envelope, Eye, EyeSlash, LockKey } from 'phosphor-react'
import { Button } from '@/components/Core/Button'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { api } from '@/lib/axios'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const { enableDarkMode } = useTheme()

  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isRouteLoading = useLoadingOnRouteChange()
  const router = useRouter()

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
      const response = await api.post('login', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      const token = response.data.token

      if (token) {
        localStorage.setItem('auth_token', token)
        toast.success('Welcome to Kanban App!')
        router.push('/')
      } else {
        toast.error('No token returned.')
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token')

    if (token) {
      router.replace('/')
    } else {
      setIsCheckingAuth(false)
    }
  }, [])

  return (
    <>
      <NextSeo title="Kanban App | Login" />

      {!isCheckingAuth && (
        <LayoutContainer>
          <LogoWrapper>
            <Image src={Logo} width={24} height={24} alt="Kanban App logo" />

            <Image
              src={
                enableDarkMode === undefined || enableDarkMode
                  ? LogoTextLight
                  : LogoTextDark
              }
              height={24}
              alt="Kanban App text logo"
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
                  <label htmlFor="email">E-mail:</label>

                  <InputContainer>
                    <IconWrapper aria-hidden="true">
                      <Envelope size={16} />
                    </IconWrapper>

                    <InputField
                      id="email"
                      type="email"
                      placeholder="e.g. jondoe@gmail.com"
                      {...register('email')}
                      aria-invalid={!!errors.email}
                    />
                  </InputContainer>

                  {errors?.email && (
                    <ErrorMessage message={errors.email.message} />
                  )}
                </FormField>

                <FormField>
                  <label htmlFor="password">Password:</label>

                  <InputContainer>
                    <IconWrapper aria-hidden="true">
                      <LockKey size={16} />
                    </IconWrapper>

                    <InputField
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                      aria-invalid={!!errors.password}
                    />

                    <PasswordIconWrapper
                      type="button"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlash size={16} aria-hidden="true" />
                      ) : (
                        <Eye size={16} aria-hidden="true" />
                      )}
                    </PasswordIconWrapper>
                  </InputContainer>

                  {errors?.password && (
                    <ErrorMessage message={errors.password.message} />
                  )}
                </FormField>
              </InputsContainer>

              <Button
                isBigger
                disabled={isSubmitting || isLoading}
                title="Login"
                type="submit"
              />

              <CreateAccountContainer>
                <p>Don&apos;t have an account?</p>
                <Link href="/register">Create account</Link>
              </CreateAccountContainer>
            </FormContainer>
          </LoginCard>

          {(isLoading || isRouteLoading) && <LoadingComponent />}
        </LayoutContainer>
      )}
    </>
  )
}
