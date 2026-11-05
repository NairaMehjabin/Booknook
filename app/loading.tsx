// app/loading.tsx
import CinnabloomSpinner from "./components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <CinnabloomSpinner fullScreen label="Opening the library gates..." />
    </div>
  );
}