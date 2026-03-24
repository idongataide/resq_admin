"use client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Form, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Images from "@/components/images";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/authAPI";
import { ResponseValue } from "@/interfaces/enums";
import toast, { Toaster } from "react-hot-toast";
import { useOnboardingStore } from "@/global/store";

    const Login = () => {
    const { setNavPath } = useOnboardingStore();
    const navigate = useNavigate();
    const { setEmail } = useOnboardingStore()
    const [loading, setLoading] = React.useState(false);

    const onFinish = (values: any) => {
    setLoading(true);

    const data = {
    email: values.email,
    password: values.password,
    };

    login(data)
    .then((res: any) => {
        if (res?.error) {
        toast.error(res.message);
        return;
        }

        if (res.status === ResponseValue.SUCCESS) {
        toast.success("Login Successful");

        setEmail(values.email);
        // localStorage.setItem(
        //     "adminToken",
        //     JSON.stringify({
        //     access: res?.data?.token,
        //     })
        // );
        navigate("/login/enter-otp");
        setNavPath("enter-otp");
        } else {
        const x = res?.response?.data?.msg;
        toast.error(x);
        }
    })
    .catch((error) => {
        toast.error(error.message || "An unexpected error occurred");
    })
    .finally(() => {
        setLoading(false);
    });
    };
      

    return (
        <div className="flex flex-col items-start w-full">
            <Toaster />
            <Helmet>
                <meta charSet="utf-8" />
                <title>RESQ: Sign in as an Admin</title>
                <link rel="canonical" href={`${URL}`} />
            </Helmet>
            {/* Logo */}
            <div className="flex justify-center m-auto mb-6">
                <img src={Images.logodark} alt="RESQ Logo" className="h-10" />
            </div>
            {/* Welcome Text */}
            <div className="mb-8 text-start ">
                <h2 className="text-2xl font-bold! text-[#475467] mb-1!">Welcome Back</h2>
                <p className="text-sm font-medium text-[#667085]">Kindly input your details to login</p>
            </div>
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                className="w-full"
            >
                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input placeholder="Enter your email" className="h-[42px] border-[#D0D5DD]!" type="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        placeholder="••••••••••••••••"
                        className="h-[42px]"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <div className="flex justify-end -mt-4 mb-2">
                    <Link to="/login/forgot-password" onClick={() => { setNavPath("forgot-password"); }}
                     className="text-[14px] text-[#DB4A47]! hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full h-[46px]! mt-3!  rounded-lg bg-[#DB4A47] text-[#DB4A47] font-medium text-lg hover:bg-gray-300 transition border-0"
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
    

export default Login;