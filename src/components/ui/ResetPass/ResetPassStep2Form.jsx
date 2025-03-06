import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


export function ResetPassStep2Form({ onSubmit }) {
    const [formData, setFormData] = useState({
        otp: '',
        password: '',
        retypePassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.retypePassword) {
            alert('Passwords do not match');
            return;
        }
        onSubmit(formData);
    };

    return (

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* OTP */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">OTP <span className="text-red-500">*</span></label>
                    <Input
                        type="text"
                        name="otp"
                        maxLength={6}
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 text-blue-500 placeholder-[var(--color-blue-500)]"
                        required
                    />


                </div>
                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">Password <span className="text-red-500">*</span></label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 text-blue-500 placeholder-[var(--color-blue-500)]"
                        required
                    />
                </div>

                {/* retype password */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">Retype Password <span className="text-red-500">*</span></label>
                    <Input
                        type="password"
                        name="retypePassword"
                        placeholder="Your password"
                        value={formData.retypePassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 text-blue-500 placeholder-[var(--color-blue-500)]"
                        required
                    />
                </div>

            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
                Next
            </Button>
        </form >

    );
}
