import { SVGProps } from 'react';

const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14"
        width="1em"
        height="1em"
        {...props}
    >
        <path
            fill="currentColor"
            d="M7 0C3.13 0 0 3.13 0 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8H6v3l.67.33L7 8h3V7l-2.4-.6L7 4z"
        />
    </svg>
);

export default ClockIcon;
