import React from "react";

export const EfizIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
      >
          <defs>
            <linearGradient id="bca5c78e-ff19-4143-82ce-11f4f108e32b" data-name="Nueva muestra de degradado 1" x1="137.96" y1="80.68" x2="344.64" y2="287.37" gradientTransform="translate(-45.1 80.72) rotate(-16.14)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4fb0a7"></stop>
              <stop offset="1" stopColor="#1a3b5d"></stop>
            </linearGradient>
            <linearGradient id="b323928c-2800-42a2-8044-fcee8b8ac3e9" x1="385.9" y1="107" x2="452.97" y2="107" gradientTransform="translate(0.64 -39.34) rotate(4.49)" xlinkHref="#bca5c78e-ff19-4143-82ce-11f4f108e32b"></linearGradient>
            <linearGradient id="adbf6060-2883-4ad1-87fe-33d00182dc79" data-name="Degradado sin nombre 5" x1="470.44" y1="137.89" x2="403.44" y2="137.52" gradientTransform="matrix(0.57, -0.82, -0.82, -0.57, 284.27, 559.23)" xlinkHref="#bca5c78e-ff19-4143-82ce-11f4f108e32b"></linearGradient>
            <pattern id="a12e24e4-a384-4d8d-b313-a2c4c464b2f8" data-name="Nueva muestra de motivo 5" width="80.97" height="80.97" patternTransform="translate(-1079.06 -29.45)" patternUnits="userSpaceOnUse" viewBox="0 0 80.97 80.97">
              <rect width="80.97" height="80.97" style={{fill: "none"}}></rect>
              <rect width="80.97" height="80.97" style={{fill: "#1a3b5d"}}></rect>
            </pattern>
          </defs>
          <title>Efiz dart logo</title>
          <g id="a821a8c0-9ef7-40cb-ad5a-101c96d1ddb7" data-name="Main forms">
            <g>
              <path d="M374.74,153.58c18.73,68.82-11.66,144.72-75.43,174.35-74.5,34.61-167.19-4.52-195.48-95.08C74.81,140,131.44,52.5,216.45,41.53,288.76,32.2,355.65,83.45,374.74,153.58Z" style={{fill: "url(#bca5c78e-ff19-4143-82ce-11f4f108e32b)"}}></path>
              <path d="M265.26,210.24c-11.67,3.73-24.42-3.57-28.17-16.39s3.08-26,15-29.17c11.62-3.09,23.73,4.5,27.25,16.81S276.64,206.6,265.26,210.24ZM257,181.61a6.18,6.18,0,1,0,7.17,4.33A6,6,0,0,0,257,181.61Z" style={{fill: "#fff"}}></path>
              <path d="M285.44,280c-48.36,19.55-105.43-8.12-122.53-64.44-17.37-57.21,15.66-113.17,68.33-122.89,47.44-8.76,93.58,24,106.81,71.64C351.12,211.37,329.11,262.35,285.44,280Zm-49.2-170.07c-42.44,8.65-68.49,54.15-54.65,100.16,13.67,45.45,59.51,68.63,99.09,53.44,36.39-14,55.07-56.12,44.11-95.34C313.71,128.56,275.19,102,236.24,109.93Z" style={{fill: "#fff"}}></path>
            </g>
            <g>
              <polygon points="290.93 174.77 258.18 187.08 288.09 168.53 291.99 160.39 396.79 113.23 436.82 98.06 437.91 100.36 438.9 102.46 402.03 124.45 299.24 176.51 290.93 174.77" style={{fill: "#fff"}}></polygon>
              <polygon points="374.4 130.54 437.98 100.52 445.75 78.58 413.01 67.14 378.06 83.86 374.4 130.54" style={{fill: "url(#b323928c-2800-42a2-8044-fcee8b8ac3e9)"}}></polygon>
              <polygon points="374.4 130.46 437.91 100.26 459.8 108.14 447.93 140.73 412.86 157.19 374.4 130.46" style={{fill: "url(#adbf6060-2883-4ad1-87fe-33d00182dc79)"}}></polygon>
            </g>
          </g>
          <g id="b0642c97-a9ca-42a0-a4a4-8b82ee7413d0" data-name="Text">
            <g>
              <circle cx="294.03" cy="371.1" r="16.05" style={{ fill: "#4fb0a7" }}></circle>
              <g className="efiz-dark-fill-color dark:fill-slate-400">
                <path d="M184.69,439V462.1H125.13A16.09,16.09,0,0,1,109,446V387.19a16.09,16.09,0,0,1,16.09-16.09H183v23.14H139.19V404.9h38.48V427H139.19v12Z"></path>
                <path d="M227.2,394.24v15.6h38V433h-38V462.1H196.52V387a15.89,15.89,0,0,1,15.9-15.89h58.07v23.14Z"></path>
                <path d="M279.34,462.1V391h29.38V462.1Z"></path>
                <path d="M403,438.31V462.1H335.21a15.84,15.84,0,0,1-15.84-15.84h0a8.1,8.1,0,0,1,2-5.3l39.58-46.07H320.67V371.1H385a15.84,15.84,0,0,1,15.84,15.84h0a8.09,8.09,0,0,1-2,5.29l-39.57,46.08Z"></path>
              </g>
            </g>
          </g>
        
        </svg>
  )
}
