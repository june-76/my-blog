import { Suspense } from "react";
import PageContent from "./content";

export default function HomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
}
