"use client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "antd";
import Images from "../../../components/images";
import OtpInput from 'react-otp-input';
import { useOnboardingStore } from '@/global/store';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { confirmLogin } from "@/api/authAPI";
import { setNavData } from "../common/setNavData";


const EnterOtp = () => {

    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { email } = useOnboardingStore();
    const navPath = useOnboardingStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 5) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

    

        setLoading(true);
        try {
            const response = await confirmLogin({ email,  otp });


            if (response?.error || response?.status === 'error' || response?.data?.status === 'error' || response?.response?.data?.status === 'error') {
                const errorMsg = response?.data?.msg || response?.response?.data?.msg || response?.message || response?.msg || 'OTP verification failed.';
                toast.error(errorMsg);
            } else if (response?.status === 'ok' || response?.data?.status === 'ok') { 
                setNavData(navPath, email, response);                               
                toast.success('OTP verified successfully!');
                localStorage.setItem(
                    "adminToken",
                    JSON.stringify({
                    access: response?.data?.token,
                    })
                );
                navigate('/home');
            } else {
                toast.error('OTP verification failed. Please try again.');
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.msg || error?.data?.msg || error?.message || 'An error occurred during OTP verification.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start w-full">
            <Helmet>
                <meta charSet="utf-8" />
                <title>RESQ: Enter OTP</title>
                {/* Update canonical URL if needed */}
                {/* <link rel="canonical" href={`${URL}/auth/enter-otp`} /> */}
            </Helmet> 
            <Toaster/>
            <div className="flex justify-center m-auto mb-6">
                <img src={Images.logodark} alt="RESQ Logo" className="h-10" />
            </div>

            {/* Welcome Text */}
            <div className="mb-8 text-start ">
                <h2 className="text-2xl font-bold! text-[#475467] mb-1!">Enter OTP</h2>
                <p className="text-sm font-medium text-[#667085]">An Otp was sent to your email <span className="text-[#FF6C2D]">{email}</span>  address to verify your account. Kindly enter the six digit code to proceed</p>
            </div>
            <form onSubmit={handleSubmit} className="py-8">                
                <p className="text-[#475467] font-medium mb-4">Input the six digits your OTP code here </p>
                
                <div className="mb-6 flex justify-center">
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={5}
                    renderInput={(props, index) => {
                    if (index === 2) {
                        return (
                        <span key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <input {...props} style={{ ...props.style, }} />
                            <span className='mx-3 font-bold text-[#D0D5DD] text-3xl'> - </span>
                        </span>
                        );
                    }
                    return <input {...props} key={index} />;
                    }}
                    shouldAutoFocus
                    inputStyle={{
                    width: '58px',
                    height: '48px',
                    margin: '0 4px',
                    fontSize: '20px',
                    borderRadius: '8px',
                    border: '1px solid #D0D5DD',
                    color: '#1C2023',
                    }}
                    containerStyle={{
                    justifyContent: 'center',
                    }}
                />
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={otp.length !== 5}
                    className={`w-full h-[46px]! mt-5 rounded-lg font-medium text-lg transition border-0 ${
                        otp.length === 6 
                        ? 'bg-[#FF6C2D] text-white hover:bg-[#E55B1F] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Proceed
                </Button>
            </form>
        </div>
    )
}
    

export default EnterOtp;