import React from 'react';
import { motion } from 'motion/react';

export function OvenAndPizzaIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-4">
      {/* Background radial soft light to give warmth */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent rounded-full blur-3xl" />

      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* DEFINITIONS FOR GRADIENTS AND PATTERNS */}
        <defs>
          {/* Fire Glow Gradient */}
          <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="30%" stopColor="#FF9F1C" />
            <stop offset="70%" stopColor="#E71D36" />
            <stop offset="100%" stopColor="#1E1A17" />
          </radialGradient>

          {/* Golden Crust Gradient */}
          <linearGradient id="crustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E89B3E" />
            <stop offset="50%" stopColor="#D47F18" />
            <stop offset="100%" stopColor="#A35606" />
          </linearGradient>

          {/* Sauce Gradient */}
          <radialGradient id="sauceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E53E3E" />
            <stop offset="80%" stopColor="#C53030" />
            <stop offset="100%" stopColor="#9B2C2C" />
          </radialGradient>

          {/* Brick/Stone Arch Gradient */}
          <linearGradient id="brickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5C4D46" />
            <stop offset="50%" stopColor="#413530" />
            <stop offset="100%" stopColor="#2A211D" />
          </linearGradient>

          {/* Paddle Wood Gradient */}
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C19A6B" />
            <stop offset="100%" stopColor="#8B5A2B" />
          </linearGradient>

          {/* Gold Metallic Text Detail */}
          <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FF6F00" />
          </linearGradient>
        </defs>

        {/* 1. ARTISANAL BRICK OVEN BACKDROP */}
        <g id="brick-oven">
          {/* Outer Oven Dome Structure */}
          <path
            d="M 60 400 C 60 160, 440 160, 440 400 Z"
            fill="url(#brickGrad)"
            stroke="#1E1A17"
            strokeWidth="6"
          />

          {/* Arch Brick Lines (Outer Rim) */}
          <path
            d="M 90 395 C 90 200, 410 200, 410 395"
            stroke="#1E1A17"
            strokeWidth="12"
            strokeDasharray="24 16"
            fill="none"
          />

          {/* Inner Oven Cave (Darkness & Fire) */}
          <path
            d="M 120 395 C 120 230, 380 230, 380 395 Z"
            fill="#1E1A17"
          />

          {/* Fire Glow Core */}
          <path
            d="M 135 395 C 135 250, 365 250, 365 395 Z"
            fill="url(#fireGlow)"
            opacity="0.85"
          />

          {/* Tiny stylized fire embers (sparkling) */}
          <circle cx="210" cy="310" r="5" fill="#FFF3B0" opacity="0.8" />
          <circle cx="280" cy="280" r="7" fill="#FF9F1C" opacity="0.9" />
          <circle cx="180" cy="340" r="6" fill="#E71D36" opacity="0.7" />
          <circle cx="320" cy="330" r="4" fill="#FFF3B0" opacity="0.9" />
        </g>

        {/* 2. WOODEN PIZZA PEEL (PADDLE) SLIDING IN */}
        <g id="pizza-peel">
          {/* Handle extending out */}
          <rect x="235" y="390" width="30" height="150" rx="4" fill="url(#woodGrad)" stroke="#1E1A17" strokeWidth="4" />
          {/* Flat paddle blade */}
          <path
            d="M 150 370 L 170 330 C 180 310, 320 310, 330 330 L 350 370 C 350 410, 150 410, 150 370 Z"
            fill="url(#woodGrad)"
            stroke="#1E1A17"
            strokeWidth="5"
          />
        </g>

        {/* 3. TRADITIONAL WOOD-FIRED PIZZA */}
        <g id="traditional-pizza">
          {/* Pizza Crust */}
          <circle cx="250" cy="355" r="95" fill="url(#crustGrad)" stroke="#1E1A17" strokeWidth="6" />

          {/* Slightly smaller circle for Sauce Base */}
          <circle cx="250" cy="355" r="82" fill="url(#sauceGrad)" />

          {/* Bubbling Cheese patches (Melted Mozzarella) */}
          <path
            d="M 190 330 C 200 310, 230 310, 240 330 C 245 340, 215 360, 190 330 Z"
            fill="#FFFDE7"
            stroke="#1E1A17"
            strokeWidth="2"
          />
          <path
            d="M 270 320 C 295 315, 315 330, 310 350 C 300 370, 260 360, 270 320 Z"
            fill="#FFFDE7"
            stroke="#1E1A17"
            strokeWidth="2"
          />
          <path
            d="M 195 375 C 185 395, 220 415, 235 390 C 245 375, 215 360, 195 375 Z"
            fill="#FFFDE7"
            stroke="#1E1A17"
            strokeWidth="2"
          />
          <path
            d="M 255 370 C 270 370, 290 395, 275 410 C 255 420, 245 385, 255 370 Z"
            fill="#FFFDE7"
            stroke="#1E1A17"
            strokeWidth="2"
          />
          <path
            d="M 220 340 C 235 340, 260 350, 245 370 C 230 380, 210 360, 220 340 Z"
            fill="#FFFDE7"
            stroke="#1E1A17"
            strokeWidth="2"
          />

          {/* Tomato Slices (Gourmet) */}
          {/* Slice 1 */}
          <g transform="translate(185, 355) scale(0.85)">
            <circle cx="20" cy="20" r="16" fill="#C53030" stroke="#1E1A17" strokeWidth="3" />
            <circle cx="20" cy="20" r="10" fill="#E53E3E" />
            {/* Tomato seeds */}
            <circle cx="16" cy="16" r="2.5" fill="#FFF3B0" />
            <circle cx="24" cy="16" r="2.5" fill="#FFF3B0" />
            <circle cx="16" cy="24" r="2.5" fill="#FFF3B0" />
            <circle cx="24" cy="24" r="2.5" fill="#FFF3B0" />
          </g>
          {/* Slice 2 */}
          <g transform="translate(265, 335) scale(0.8)">
            <circle cx="20" cy="20" r="16" fill="#C53030" stroke="#1E1A17" strokeWidth="3" />
            <circle cx="20" cy="20" r="10" fill="#E53E3E" />
            <circle cx="16" cy="16" r="2.5" fill="#FFF3B0" />
            <circle cx="24" cy="16" r="2.5" fill="#FFF3B0" />
            <circle cx="16" cy="24" r="2.5" fill="#FFF3B0" />
            <circle cx="24" cy="24" r="2.5" fill="#FFF3B0" />
          </g>
          {/* Slice 3 */}
          <g transform="translate(235, 385) scale(0.9)">
            <circle cx="20" cy="20" r="16" fill="#C53030" stroke="#1E1A17" strokeWidth="3" />
            <circle cx="20" cy="20" r="10" fill="#E53E3E" />
            <circle cx="16" cy="16" r="2.5" fill="#FFF3B0" />
            <circle cx="24" cy="16" r="2.5" fill="#FFF3B0" />
            <circle cx="16" cy="24" r="2.5" fill="#FFF3B0" />
            <circle cx="24" cy="24" r="2.5" fill="#FFF3B0" />
          </g>

          {/* Fresh Green Basil Leaves */}
          {/* Leaf 1 */}
          <path
            d="M 210 325 C 205 305, 225 300, 225 315 C 225 330, 215 335, 210 325 Z"
            fill="#38A169"
            stroke="#1E1A17"
            strokeWidth="2.5"
          />
          {/* Leaf 2 */}
          <path
            d="M 290 365 C 310 360, 315 375, 300 380 C 285 385, 280 375, 290 365 Z"
            fill="#2F855A"
            stroke="#1E1A17"
            strokeWidth="2.5"
          />
          {/* Leaf 3 */}
          <path
            d="M 220 380 C 215 395, 200 395, 205 385 C 210 375, 225 370, 220 380 Z"
            fill="#48BB78"
            stroke="#1E1A17"
            strokeWidth="2"
          />
          {/* Leaf 4 (Floating near top of pizza) */}
          <path
            d="M 255 305 C 255 290, 240 285, 245 298 C 250 310, 260 315, 255 305 Z"
            fill="#38A169"
            stroke="#1E1A17"
            strokeWidth="2"
          />

          {/* Little black olive rings */}
          <circle cx="255" cy="335" r="6" stroke="#1E1A17" strokeWidth="4" fill="none" />
          <circle cx="215" cy="355" r="6" stroke="#1E1A17" strokeWidth="4" fill="none" />
          <circle cx="280" cy="390" r="6" stroke="#1E1A17" strokeWidth="4" fill="none" />
        </g>

        {/* 4. STEAM & COOKING AROMA (Subtle rising curves) */}
        <g id="steam" opacity="0.75">
          {/* Steam wave 1 */}
          <path
            d="M 215 260 Q 205 230, 220 200 T 210 140"
            stroke="#FFF3B0"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Steam wave 2 */}
          <path
            d="M 250 250 Q 260 215, 245 180 T 255 120"
            stroke="#FFF3B0"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Steam wave 3 */}
          <path
            d="M 285 265 Q 275 235, 290 205 T 280 145"
            stroke="#FFF3B0"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 5. ARABESQUE FRAMEWORK / OLIVE BRANCH ACCENTS */}
        <g id="flourish-decor" opacity="0.85">
          {/* Left olive branch */}
          <path
            d="M 40 380 Q 20 260, 100 130"
            stroke="#4F5D2F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Olive leaves left */}
          <path d="M 25 310 Q 12 300, 20 290 Q 35 295, 28 310" fill="#4F5D2F" />
          <path d="M 42 250 Q 30 235, 40 225 Q 55 235, 47 250" fill="#4F5D2F" />
          <path d="M 70 180 Q 58 165, 70 155 Q 85 165, 75 180" fill="#4F5D2F" />

          {/* Right olive branch */}
          <path
            d="M 460 380 Q 480 260, 400 130"
            stroke="#4F5D2F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Olive leaves right */}
          <path d="M 475 310 Q 488 300, 480 290 Q 465 295, 472 310" fill="#4F5D2F" />
          <path d="M 458 250 Q 470 235, 460 225 Q 445 235, 453 250" fill="#4F5D2F" />
          <path d="M 430 180 Q 442 165, 430 155 Q 415 165, 425 180" fill="#4F5D2F" />
        </g>
      </svg>
    </div>
  );
}

export function PizzaSilhouetteIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-amber-500 fill-current opacity-90 transition-transform duration-300 hover:scale-110"
    >
      <path d="M 50 10 C 27.9 10, 10 27.9, 10 50 C 10 72.1, 27.9 90, 50 90 C 72.1 90, 90 72.1, 90 50 C 90 27.9, 72.1 10, 50 10 Z M 50 82 C 32.3 82, 18 67.7, 18 50 C 18 32.3, 32.3 18, 50 18 C 67.7 18, 82 32.3, 82 50 C 82 67.7, 67.7 82, 50 82 Z" />
      {/* Slice markings */}
      <line x1="50" y1="18" x2="50" y2="82" stroke="currentColor" strokeWidth="4" />
      <line x1="18" y1="50" x2="82" y2="50" stroke="currentColor" strokeWidth="4" />
      <line x1="27.4" y1="27.4" x2="72.6" y2="72.6" stroke="currentColor" strokeWidth="4" />
      <line x1="27.4" y1="72.6" x2="72.6" y2="27.4" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function ChefHatIllustration() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-terracotta fill-current opacity-85 mx-auto"
    >
      <path d="M 50 15 C 38 15, 30 23, 30 33 C 22 35, 18 43, 23 51 C 20 58, 25 66, 33 66 C 33 73, 40 78, 50 78 C 60 78, 67 73, 67 66 C 75 66, 80 58, 77 51 C 82 43, 78 35, 70 33 C 70 23, 62 15, 50 15 Z" fill="#C93C20" />
      <rect x="35" y="72" width="30" height="12" rx="3" fill="#1E1A17" />
    </svg>
  );
}
