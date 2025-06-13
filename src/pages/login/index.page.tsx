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
import { Button } from '@/components/Shared/Button'
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
            <Image src={Logo} width={24} height={24} alt="" />
            <Image
              src={
                enableDarkMode === undefined || enableDarkMode
                  ? LogoTextLight
                  : LogoTextDark
              }
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                    />
                    <PasswordIconWrapper
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
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
