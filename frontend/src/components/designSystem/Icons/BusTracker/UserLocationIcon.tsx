

export default function UserLocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
            <circle cx="18.5" cy="18.5" r="18.5" fill="#FFB300" fillOpacity="0.2"/>
            <g filter="url(#filter0_d_1175_15548)">
                <circle cx="18.5" cy="18" r="9" fill="#FFB300"/>
                <circle cx="18.5" cy="18" r="8" stroke="white" strokeWidth="2"/>
            </g>
            <defs>
                <filter id="filter0_d_1175_15548" x="7.5" y="8" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="1"/>
                    <feGaussianBlur stdDeviation="1"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.133333 0 0 0 0 0.133333 0 0 0 0 0.207843 0 0 0 0.3 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1175_15548"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1175_15548" result="shape"/>
                </filter>
            </defs>
        </svg>
    )
}