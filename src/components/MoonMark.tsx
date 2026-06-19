export default function MoonMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 4.5C14.4 5.6 9.5 11.3 9.5 18.1 9.5 25.6 15.6 31.5 23 31.2c-3.6 2-7.9 2.7-12.3 1.5C3.7 30.8-1 23.6 0.6 16.5 2.1 9.7 8.1 4.6 15.1 4.5c2.1 0 4.1.3 5.9 1z"
        fill="currentColor"
        transform="translate(2 -1)"
      />
    </svg>
  );
}
