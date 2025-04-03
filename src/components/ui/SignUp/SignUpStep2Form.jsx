import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SignUpStep2Form({ onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        retypePassword: '',
        bio: '',
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
                {/* First Name */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">
                        First name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="firstName"
                        placeholder="Your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 text-blue-500 placeholder-[var(--color-blue-500)]"
                        required
                    />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">
                        Last name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="lastName"
                        placeholder="Your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 text-blue-500 placeholder-[var(--color-blue-500)]"
                        required
                    />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-gray-50`}
                            required
                        />
                    </div>

                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                            setFormData(prev => ({ ...prev, gender: value }))
                        }
                        required
                    >
                        <SelectTrigger className={`w-full bg-gray-50`}
                        >
                            <SelectValue className="font-thin" placeholder="Your gender" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="male"> Male</SelectItem>
                            <SelectItem value="female"> Female</SelectItem>
                            <SelectItem value="other" >Other</SelectItem>
                        </SelectContent>
                    </Select>
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

            {/* Bio */}
            <div className="space-y-2">
                <label className="text-sm text-gray-700 font-semibold">
                    Bio
                </label>
                <Textarea
                    name="bio"
                    placeholder="✨ Say something about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 min-h-[50px] text-blue-500"
                />
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