import React from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IAuth } from "../../interfaces/auth.internface";
import { login, selectAuth, signUp } from "../../redux/auth/authSlice";
import store from "../../redux/store";
import styles from "./css/Login.module.css";

interface ILogin {
  isSignUp: boolean;
}

const Login: React.FC<ILogin> = ({ isSignUp }) => {
  const navigate = useNavigate();

  const [data, setData] = React.useState<IAuth>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (data.username.length == 0 && data.password.length == 0) {
      toast.error("Please enter username and password!");
      return;
    }

    if (isSignUp) {
      const res = await store.dispatch(signUp(data));
      if (res.payload.status === "failure") {
        toast.error(res.payload.data);
        return;
      }
      toast.success("Registration Successful!");
      navigate("/");
    } else {
      const res = await store.dispatch(login(data));
      if (res.payload.status === "failure") {
        toast.error(res.payload.data);
        return;
      }
      toast.success("You are logged in!");
      navigate("/app", { replace: true });
    }
  };

  return (
    <div className={styles.wrapper}>
      {isSignUp ? <h1>SIGN UP</h1> : <h1>LOGIN</h1>}
      <form onSubmit={handleSubmit} autoSave="on">
        <input
          onChange={(e) => handleChange(e)}
          type="name"
          name="username"
          autoFocus
          value={data.username}
          placeholder="Username"
        />
        <input
          onChange={(e) => handleChange(e)}
          type="password"
          name="password"

          value={data.password}
          placeholder="Password"
        />
        <input type="submit" value="Continue" />

        {isSignUp ? (
          <p>
            Already have an account? <Link to={"/"}>LOGIN</Link>
          </p>
        ) : (
          <p>
            Don't have account? <Link to={"/signup"}>SIGN UP</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
