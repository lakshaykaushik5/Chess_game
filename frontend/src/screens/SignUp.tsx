import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signup_image from "../../public/images/sign.png";
import { AUTH_URL } from "@/env";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const navigate = useNavigate();

  console.log(email, " ", password, " ", verifyPassword);

  const signUp = async () => {
    if (!email || password != verifyPassword || !password) {
      return;
    }
    const payload = {
      username: email.split("@")[0],
      useremail: email,
      userpassword: password,
    };
    const response = await axios.post(AUTH_URL + "/auth/basic/SignUp", payload);
    if (response?.data?.data?.status === 200) {
      localStorage.setItem("USER_DET", response?.data?.data?.result);
      navigate("/Landing");
      console.log("Login Sucessfully");
    }
    setEmail("");
    setPassword("");
    setVerifyPassword("");
  };

  const LogIn = async () => {
    if (!email || !password) {
      return;
    }
    const payload = {
      useremail: email,
      password: password,
    };

    const response = await axios.post(AUTH_URL + "/auth/basic/login", payload);
    if (response.data.data.status === 200) {
      // alert("Login Successfully");
      const id = response?.data?.data?.result;
      alert(id);
      localStorage.setItem("USER_DET", id);
      navigate("/Landing");
    }
    setEmail("");
    setPassword("");
    setVerifyPassword("");
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-2">
          <div className="flex items-center justify-center py-12">
            <Tabs defaultValue="LogIn" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="SignUp">SignUp</TabsTrigger>
                <TabsTrigger value="LogIn">LogIn</TabsTrigger>
              </TabsList>
              <TabsContent value="SignUp">
                <Card>
                  <CardHeader>
                    <CardTitle>SignUp</CardTitle>
                    <CardDescription>Create Account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">User Email</Label>
                      <Input
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        defaultValue=""
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="repassword">Verify Password</Label>
                      <Input
                        id="repassword"
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        type="password"
                        defaultValue=""
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={signUp}>Create Account</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="LogIn">
                <Card>
                  <CardHeader>
                    <CardTitle>LogIn</CardTitle>
                    <CardDescription>SignIn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="username">email</Label>
                      <Input
                        id="username"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="verifypassword">password</Label>
                      <Input
                        id="verifypassword"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={LogIn}>Log In</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mx-auto">
            <img
              src={signup_image}
              className="w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width="1920"
              height="1080"
              style={{ height: "97%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
