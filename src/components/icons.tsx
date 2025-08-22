import type { SVGProps } from 'react';

export function ChainEyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M10.5 10.5 7 14" />
      <path d="m13.5 10.5 3.5 3.5" />
      <path d="M10.5 13.5 7 10" />
      <path d="m13.5 13.5 3.5-3.5" />
    </svg>
  );
}
