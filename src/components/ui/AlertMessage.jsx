import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

// eslint-disable-next-line react/prop-types
export function AlertMessage({ type, message }) {
    if (!message) return null;

    const alertStyles = {
        error: "border-red-500 bg-red-50 text-red-600",
        success: "border-green-500 bg-green-50 text-green-600",
        info: "border-blue-500 bg-blue-50 text-blue-600"
    };

    const icons = {
        error: <AlertCircle className="h-4 w-4" />,
        success: <CheckCircle2 className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />
    };

    return (
        <Alert className={`${alertStyles[type]} flex items-center`}>
            {icons[type]}
            <AlertDescription className="ml-2">
                {message}
            </AlertDescription>
        </Alert>
    );
}