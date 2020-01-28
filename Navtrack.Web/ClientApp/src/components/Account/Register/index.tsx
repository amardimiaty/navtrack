import React, { FormEvent, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Errors, ApiError } from "services/HttpClient/HttpClient";
import AppContext from "services/AppContext";
import InputError, { HasErrors, AddError } from "components/Common/InputError";
import { AccountApi } from "services/Api/AccountApi";
import LoginLayout from "components/Framework/Layouts/Login/LoginLayout";
import Icon from "components/Framework/Util/Icon";
import { DefaultRegisterModel, RegisterModel } from "./RegisterModel";

export default function Register() {
  const [registerModel, setRegisterModel] = useState<RegisterModel>(DefaultRegisterModel);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const errors = validateModel(registerModel);

    if (HasErrors(errors)) {
      setErrors(errors);
    } else {
      setShowLoadingIndicator(true);

      AccountApi.register(registerModel)
        .then(() => {
          setShowSuccess(true);
        })
        .catch((error: ApiError) => {
          setErrors(error.errors);
          setShowLoadingIndicator(false);
        });
    }
  };

  return (
    <LoginLayout>
      <div className="max-w-xs w-full flex flex-col items-center">
        <div className="h-16 m-3 ">
          <a href="https://www.navtrack.io">
            <img src="/navtrack.png" width="64" className="mb-4" alt="Navtrack" />
          </a>
        </div>
        <div className="shadow-xl bg-white rounded px-8 w-full bg-gray-100">
          {showSuccess ?
            <div className="text-center my-6">Your account was successfully created, you can login now.</div>
            :
            <>
              <div className="text-center my-6">Register</div>
              <form onSubmit={(e) => signIn(e)}>
                <div className="mb-4">
                  <input className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" id="email" type="email" placeholder="Email"
                    value={registerModel.email} onChange={(e) => setRegisterModel({ ...registerModel, email: e.target.value })}
                  />
                  <InputError name="email" errors={errors} />
                </div>
                <div className="mb-4">
                  <input className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border focus:border-gray-900" id="password" type="password" placeholder="Password"
                    value={registerModel.password} onChange={(e) => setRegisterModel({ ...registerModel, password: e.target.value })}
                  />
                  <InputError name="password" errors={errors} />
                </div>
                <div className="mb-4">
                  <input className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border focus:border-gray-900" id="confirmPassword" type="password" placeholder="Confirm password"
                    value={registerModel.confirmPassword} onChange={(e) => setRegisterModel({ ...registerModel, confirmPassword: e.target.value })}
                  />
                  <InputError name="confirmPassword" errors={errors} />
                </div>
                <div className="flex justify-center my-6">
                  <button className="shadow-md bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="submit">
                    <Icon icon="fa-spinner fa-spin" show={showLoadingIndicator} /> Register
                </button>
                </div>
              </form>
            </>
          }
        </div>
        <div className="h-20 flex w-full">
          <div className="flex-grow">
            <Link to="/login" className="text-white text-xs">Back to login</Link>
          </div>
          <div className="flex-grow text-right">
            {/* <Link to="/forgotpassword" className="text-white text-xs">Forgot password?</Link> */}
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

const validateModel = (registerModel: RegisterModel): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  if (registerModel.email.length === 0) {
    AddError<RegisterModel>(errors, "email", "Email is required.");
  }
  if (registerModel.password.length === 0) {
    AddError<RegisterModel>(errors, "password", "Password is required.");
  }
  if (registerModel.confirmPassword.length === 0) {
    AddError<RegisterModel>(errors, "confirmPassword", "Password confirmation is required.");
  }
  else if (registerModel.password != registerModel.confirmPassword) {
    AddError<RegisterModel>(errors, "confirmPassword", "The passwords must match.");
  }

  return errors;
};