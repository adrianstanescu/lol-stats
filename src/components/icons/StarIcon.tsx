import { SVGProps } from 'react';

const StarIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="1em" height="1em" {...props}>
        <path
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            d="M21.803 6.085c.899-1.82 3.495-1.82 4.394 0l4.852 9.832 10.85 1.577c2.01.292 2.813 2.762 1.358 4.179l-7.85 7.653 1.853 10.806c.343 2.002-1.758 3.528-3.555 2.583L24 37.613l-9.705 5.102c-1.797.945-3.898-.581-3.555-2.583l1.854-10.806-7.851-7.653c-1.455-1.417-.652-3.887 1.357-4.179l10.85-1.577 4.853-9.832Z"
            
        />
    </svg>
);

export default StarIcon;
