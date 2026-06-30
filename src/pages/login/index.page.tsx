import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faRightToBracket,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'

import Logo from '@/../public/icon.svg'
import LogoTextLight from '@/../public/kanban.svg'
import LogoTextDark from '@/../public/kanban-dark.svg'
import {
  CreateAccountContainer,
  FormContainer,
  InputsContainer,
  LayoutContainer,
  LoginCard,
  LogoWrapper,
  OrDivider,
  Tagline,
  TitleContainer,
} from './styles'
import { Button } from '@/components/Core/Button'
import { LoadingComponent } from '@/components/Shared/LoadingComponent'
import { AuthField } from './partials/AuthField'
import { PasswordField } from './partials/PasswordField'
import { useTheme } from '@/contexts/ThemeContext'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { useAuthUser } from '@/hooks/useAuthUser'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const { enableDarkMode } = useTheme()

  const { isCheckingAuth } = useRedirectIfAuthenticated()
  const { mutate: revalidateAuth } = useAuthUser()
  const isRouteLoading = useLoadingOnRouteChange()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

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
      await api.post('login', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      // session now lives in the httpOnly cookie — refresh /user so the app
      // picks up the authenticated state before navigating
      await revalidateAuth()
      toast.success('Welcome to Kanban App!')
      router.push('/')
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDemoLogin() {
    setIsDemoLoading(true)

    try {
      // No credentials — the backend signs us into the shared demo account and
      // reseeds its sample workspace so we always land on a clean, full board.
      await api.post('demo-login')

      await revalidateAuth()
      toast.success('Welcome! Explore the demo workspace.')
      router.push('/')
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsDemoLoading(false)
    }
  }

  if (isCheckingAuth) return null

  return (
    <>
      <NextSeo title="Kanban App | Login" />

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

        <Tagline>Organize projects with clarity.</Tagline>

        <LoginCard>
          <TitleContainer>
            <h1>Login</h1>
            <p>Welcome back. Sign in to continue.</p>
          </TitleContainer>

          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <InputsContainer>
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
              disabled={isDemoLoading}
              type="submit"
            >
              <FontAwesomeIcon
                icon={faRightToBracket}
                style={{ fontSize: 14 }}
                aria-hidden="true"
              />
              Login
            </Button>

            <OrDivider>or</OrDivider>

            <Button
              type="button"
              variant="secondary"
              isBigger
              isLoading={isDemoLoading}
              disabled={isSubmitting || isLoading}
              onClick={handleDemoLogin}
            >
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                style={{ fontSize: 14 }}
                aria-hidden="true"
              />
              Explore the demo
            </Button>

            <CreateAccountContainer>
              <p>Don&apos;t have an account?</p>
              <Link href="/register">Create account</Link>
            </CreateAccountContainer>
          </FormContainer>
        </LoginCard>

        {(isLoading || isDemoLoading || isRouteLoading) && <LoadingComponent />}
      </LayoutContainer>
    </>
  )
}
