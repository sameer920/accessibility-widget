import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import SignUpForm from '@/components/Auth/SignUpForm';
import AuthAdsArea from '@/components/Auth/AuthAds';
import registerQuery from '@/queries/auth/register';
import getQueryParam from '@/utils/getQueryParam';
import StripeContainer from '@/containers/Stripe';
import {
  SignUpFormWrapper,
  SignUpFormLeft,
  SignUpAds,
} from '@/components/Auth/AuthForm';
import useDocumentHeader from '@/hooks/useDocumentTitle';

const SignUpSchema = yup.object().shape({
  name: yup.string().required('Common.validation.require_name'),
  email: yup.string().required('Common.validation.require_email').email('Common.validation.valid_email'),
  password: yup
    .string()
    .required('Common.validation.require_password')
    .min(6, 'Common.validation.min_password'),
  passwordConfirmation: yup
    .string()
    .required('Common.validation.require_password_confirm')
    .oneOf([yup.ref('password'), ""], 'Common.validation.password_match'),
});

type SignUpPayload = {
  email?: string;
  password?: string;
  name?: string;
  paymentMethodToken: string | null;
  planName: string | null;
  billingType: 'MONTHLY' | 'YEARLY';
}

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  useDocumentHeader({ title: t('Common.title.sign_up') });
  const { register, handleSubmit, errors: formErrors } = useForm({
    resolver: yupResolver(SignUpSchema),
    shouldUnregister: false,
  });
  const [registerMutation, { error, loading }] = useMutation(registerQuery);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [formData, setFormData] = useState({});
  const history = useHistory();
  const query = getQueryParam();
  const planName = query.get('plan');

  async function signup(params: SignUpPayload) {
    const { data } = await registerMutation({ variables: params });
    if (data?.register) {
      history.push('/');
    }
  }

  async function onSubmit(params: SignUpPayload) {
    if (planName) {
      setShowStripeForm(true);
      setFormData(params);
    } else {
      signup(params);
    }
  }

  function createPaymentMethodSuccess(token: string) {
    const data: SignUpPayload = {
      ...formData,
      paymentMethodToken: token,
      planName,
      billingType: query.get('isYearly') === '1' ? 'YEARLY' : 'MONTHLY',
    };
    signup(data);
  }

  function handleGoBack() {
    setShowStripeForm(false);
  }

  return (
    <SignUpFormWrapper>
      <SignUpFormLeft>
        {showStripeForm ? (
          <StripeContainer
            onSubmitSuccess={createPaymentMethodSuccess}
            onGoBack={handleGoBack}
            apiLoading={loading}
            apiError={error?.graphQLErrors?.[0]?.extensions?.code}
          />
        ) : (
          <SignUpForm
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            formErrors={formErrors}
            apiError={error?.graphQLErrors?.[0]?.extensions?.code}
            isSubmitting={loading}
            submitText={String(planName ? t('Sign_up.text.next') : t('Sign_up.text.button_text'))}
          />
        )}
      </SignUpFormLeft>
      <SignUpAds>
        <AuthAdsArea />
      </SignUpAds>
    </SignUpFormWrapper>
  );
};

export default SignUp;
