import React from 'react';
import { Button } from "@/components/ui/button";
import { Rocket } from 'lucide-react';
import { useNavigate } from "react-router-dom";


export function SignUpStep4Banner() {
    const navigate = useNavigate();
    return (
        <div
            className="w-full h-full mt-10 flex-col justify-center content-center items-center space-y-6"
            style={{
                backgroundImage: `url("https://s3-alpha-sig.figma.com/img/41e5/bd81/c93212ba439880f47ac9494cec597c49?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NuZzYiBm0fJ~tWUa5lUb4ikCT8Rn6ejjh~-xj~aSdR18z2p0Zrrv~Lcih1WGhIRTitaD4aKOQkXHRCEbvpgoOMoOki7Uj8KAa65v7xrqYWA6kk2RQwpnaykMC2S~a-O-jj2gxlxGco5xI2IMrFWgBKiofrqWVgLqNNR~GYckYil1emkYSxXzZL~WeSULEzwrVhq-F0VePSgVMbKmaIapxlmWAQQDlGENZl3M-nwPFLOGoX2zqp7TOiPvalt909BtrlknY4eSLgaiB3wV8bj9NrCsX4AFrxQ27DWYB2XsaiFDou0OoqPwCuF-QnnwpUlozZGXDO59aZeLb7YR~uthfA__")`,
                backgroundSize: "45% 65%",
                backgroundPosition: "top left",
                backgroundRepeat: "no-repeat",
                backgroundWidth: "50%",
            }}
        >
            <div className="mb-6">
                <h1 className="text-xl font-bold mb-2">
                    WELCOME TO{" "}
                    <span className="text-[#0072CE]">D</span>
                    <span className="text-[#FF9900]">O</span>
                    <span className="text-[#0072CE]">RA</span>
                </h1>
            </div>

            <p className="text-xl mb-6">Let&apos;s start a conversation with everyone.</p>
            <Button
                className="bg-[#0072CE] hover:bg-[#0062B1] text-white px-6 py-2 rounded-full text-lg"
                onClick={() => navigate("/login")}
            >
                <Rocket className="w-5 h-5 mr-2" /> Get started
            </Button>
        </div>
    );
}