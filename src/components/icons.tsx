import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
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
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" stroke="none" />
      <path d="M12 3v1M12 21v-1" stroke="hsl(var(--background))" />
      <path d="M12 3a4.5 4.5 0 0 0-4.5 4.5v.001C7.5 12.28 12 15.36 12 15.36s4.5-3.08 4.5-7.859V7.5A4.5 4.5 0 0 0 12 3z" />
      <path d="M8.5 6A3.5 3.5 0 0 1 12 3.5a3.5 3.5 0 0 1 3.5 2.5" stroke="currentColor"/>
    </svg>
  ),
  plant: (props: SVGProps<SVGSVGElement> & { progress: number }) => {
    const { progress, ...rest } = props;
    return (
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path d="M50 95V40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path
          d="M50 55C40 50 35 35 40 25"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            opacity: progress > 0.3 ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
        <path
          d="M50 50C60 45 65 30 60 20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            opacity: progress > 0.6 ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
        <path
          d="M50 40C45 35 40 25 45 15"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            opacity: progress > 0.8 ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
        <circle 
          cx="50" 
          cy="20" 
          r="15" 
          fill="currentColor" 
          style={{
            transform: `scale(${Math.min(1, progress * 1.2)})`,
            opacity: progress > 0.9 ? 1 : 0,
            transformOrigin: '50% 50%',
            transition: 'transform 0.5s, opacity 0.5s'
          }}
        />
      </svg>
    )
  }
};
