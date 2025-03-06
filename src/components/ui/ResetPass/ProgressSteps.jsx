import { User, Mail, Info, CheckCircle } from 'lucide-react';
import { Step } from '@/components/ui/ResetPass/Step';
import { Line } from '@/components/ui/ResetPass/Line';

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
                label="Reset password"
                icon={<Info className="w-4 h-4" />}
                active={currentStep === 2}
            />

        </div>
    );
}