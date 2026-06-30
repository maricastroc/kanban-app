import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faUser,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'

import Logo from '@/../public/icon.svg'
import {
  CreateAccountContainer,
  FormContainer,
  InputsContainer,
  LayoutContainer,
  LoginCard,
  LogoWrapper,
  Tagline,
  TitleContainer,
} from '../login/styles'
import { Button } from '@/components/Core/Button'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { AuthField } from '../login/partials/AuthField'
import { PasswordField } from '../login/partials/PasswordField'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'

const signUpFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters.' }),
  email: z
    .string()
    .min(3, { message: 'E-mail must have at least 3 characters.' }),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/\d/, 'Password must contain at least one number.'),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export default function Register() {
  const { isCheckingAuth } = useRedirectIfAuthenticated()
  const isRouteLoading = useLoadingOnRouteChange()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignUpFormData) {
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

  if (isCheckingAuth) return null

  return (
    <>
      <NextSeo title="Cadence | Register" />

      <LayoutContainer>
        <LogoWrapper>
          <Image src={Logo} width={24} height={24} alt="Cadence logo" />
          <span className="wordmark">cadence</span>
        </LogoWrapper>

        <Tagline>Organize projects with clarity.</Tagline>

        <LoginCard>
          <TitleContainer>
            <h1>Create account</h1>
            <p>Let&apos;s get you started organizing your tasks!</p>
          </TitleContainer>

          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <InputsContainer>
              <AuthField
                id="name"
                label="Name"
                type="text"
                placeholder="e.g. Jon Doe"
                icon={faUser}
                error={errors.name?.message}
                {...register('name')}
              />

              <AuthField
                id="email"
                label="Email"
                type="email"
                placeholder="e.g. jondoe@gmail.com"
                icon={faEnvelope}
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordField
                error={errors.password?.message}
                {...register('password')}
              />
            </InputsContainer>

            <Button
              isBigger
              isLoading={isSubmitting || isLoading}
              type="submit"
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                style={{ fontSize: 14 }}
                aria-hidden="true"
              />
              Sign Up
            </Button>

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
