import * as React from "react"
import { User, Mail, Info, CheckCircle } from 'lucide-react';
import { Step } from './Step';
import { Line } from './Line';

export function ProgressSteps({ currentStep }) {
    return (
        <div className="flex justify-between items-center">
            <Step
                number={1}
                label="Your contact"
                icon={<User className="w-4 h-4" />}
                active={currentStep === 1}
            />
            <Line />
            <Step
                number={2}
                label="OTP code"
                icon={<Mail className="w-4 h-4" />}
                active={currentStep === 2}
            />
            <Line />
            <Step
                number={3}
                label="Your information"
                icon={<Info className="w-4 h-4" />}
                active={currentStep === 3}
            />
            <Line />
            <Step
                number={4}
                label="Done"
                icon={<CheckCircle className="w-4 h-4" />}
                active={currentStep === 4}
            />
        </div>
    );
}