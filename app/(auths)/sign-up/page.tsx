"use client";

import AuthForm from "@/components/forms/AuthForm"
import { signupWithCredentials } from "@/lib/handlers/actions/auth.action";
import { SignUpSchema } from "@/lib/validations"

const SignUp = () => {
  return (
    <div>
      <AuthForm 
        formType="SIGN_UP" schema={SignUpSchema} defaultValues={{email: "", password: "", name: "", username: ""}} onSubmit={signupWithCredentials}
      />
    </div>
  )
}

export default SignUp