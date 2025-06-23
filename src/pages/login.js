import React from 'react';
import Layout from '@theme/Layout';
import LoginForm from '@site/src/components/LoginForm';

export default function Login() {
  return (
    <Layout title="Login Editor">
      <main style={{ padding: '2rem' }}>
        <LoginForm />
      </main>
    </Layout>
  );
}