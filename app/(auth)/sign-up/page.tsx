import AuthForm from '@/components/AuthForm'
import React from 'react'
const signUp = async() => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
       <AuthForm type='sign-up'/>
    </section>
  )
}

export default signUp