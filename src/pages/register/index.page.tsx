/* eslint-disable react-hooks/exhaustive-deps */
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
import { Envelope, LockKey, User } from 'phosphor-react'
import { Button } from '@/components/Core/Button'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { NextSeo } from 'next-seo'

const signInFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must have at least 3 characters..' }),
  email: z
    .string()
    .min(3, { message: 'E-mail must have at least 3 characters..' }),
  password: z
    .string()
    .min(3, { message: 'Password must have at least 3 characters.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const { enableDarkMode } = useTheme()

  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const [isLoading, setIsLoading] = useState(false)

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
      const response = await api.post('/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
      })

      if (response.data) {
        toast.success(response.data.message)
        router.push('/login')
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
      <NextSeo title="Kanban App | Register" />
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
              width={112}
              height={24}
              alt="Kanban App text logo"
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
                  <label htmlFor="name">Name:</label>

                  <InputContainer>
                    <IconWrapper aria-hidden="true">
                      <User size={16} />
                    </IconWrapper>
                    <InputField
                      id="name"
                      type="text"
                      placeholder="e.g. Jon Doe"
                      {...register('name')}
                    />
                  </InputContainer>

                  {errors?.name && (
                    <ErrorMessage message={errors.name.message} />
                  )}
                </FormField>

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
      )}
    </>
  )
}
