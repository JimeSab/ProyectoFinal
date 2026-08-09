import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange }) {
    return (
        <div className="relative w-full max-w-md mb-8 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Search className="h-4 w-4" />
            </div>
            <Input
                placeholder="Buscar servicio..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-4 py-6 bg-background border-[#F5AFAF] shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#F5AFAF] hover:border-[#F5AFAF]"
            />
        </div>
    );
}

SearchBar.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};