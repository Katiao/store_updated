import { FormInput, SubmitBtn } from "../components";
import { Form, Link, redirect, ActionFunctionArgs } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { customFetch } from "../utils";

// TODO: move elsewhere and possible to types file if reused somewhere else
type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as RegisterFormData;

  try {
    const response = await customFetch.post("/auth/local/register", data);
    toast.success("account created successfully");
    console.log("response", response);
    return redirect("/login");
  } catch (error) {
    // TODO: handle error type better
    const axiosError = error as AxiosError<any>;
    console.error("Registration error:", axiosError);

    const errorMessage =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "Please double check your credentials";

    toast.error(errorMessage);
    return null;
  }
};

export const Register = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>

        <FormInput type="text" label="username" name="username" />
        <FormInput type="email" label="email" name="email" />
        <FormInput type="password" label="password" name="password" />

        <div className="mt-4">
          <SubmitBtn text="register" />
        </div>

        <p className="text-center">
          Already a member?
          <Link
            to="/login"
            className="ml-2 link link-hover link-primary capitalize"
          >
            login
          </Link>
        </p>
      </Form>
    </section>
  );
};
