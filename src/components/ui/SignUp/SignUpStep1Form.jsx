import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignUpStep1Form({ email, setEmail, onSubmit }) {
    return (
        <div className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter your mail or phone"
                    value={email}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Next
                </Button>
            </form>
        </div>
    );
}