@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 0 72% 51%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 26 95% 56%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 0 72% 51%;
    --chart-1: 0 72% 51%;
    --chart-2: 26 95% 56%;
    --chart-3: 173 58% 39%;
    --chart-4: 43 74% 66%;
    --chart-5: 280 65% 60%;
    --radius: 0.75rem;

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;
  }

  .dark {
    --background: 222 47% 7%;
    --foreground: 210 40% 98%;
    --card: 222 44% 10%;
    --card-foreground: 210 40% 98%;
    --popover: 222 44% 10%;
    --popover-foreground: 210 40% 98%;
    --primary: 0 75% 57%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 26 90% 55%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 63% 45%;
    --destructive-foreground: 0 0% 100%;
    --border: 217 33% 20%;
    --input: 217 33% 20%;
    --ring: 0 75% 57%;
    --chart-1: 0 75% 57%;
    --chart-2: 26 90% 55%;
    --chart-3: 173 58% 45%;
    --chart-4: 43 74% 66%;
    --chart-5: 280 65% 60%;

    --success: 142 64% 42%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: 'cv11', 'ss01';
    text-rendering: optimizeLegibility;
  }
  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 9999px;
  }
  .glass {
    background: hsl(var(--card) / 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .gradient-primary {
    background-image: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  }
  .text-gradient {
    background-image: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .shadow-glow {
    box-shadow: 0 0 0 1px hsl(var(--primary) / 0.1), 0 8px 30px -8px hsl(var(--primary) / 0.35);
  }
  .shadow-card {
    box-shadow: 0 1px 2px hsl(var(--foreground) / 0.04), 0 4px 16px -4px hsl(var(--foreground) / 0.08);
  }
}

/* Marquee */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
[dir='rtl'] .animate-marquee {
  animation: marquee 30s linear infinite reverse;
}

/* Shimmer skeleton */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    transparent,
    hsl(var(--muted-foreground) / 0.08),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

/* Fade up */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fade-up 0.5s ease-out both;
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in {
  animation: scale-in 0.3s ease-out both;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.5); }
  70% { box-shadow: 0 0 0 10px hsl(var(--primary) / 0); }
  100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0); }
}
.animate-pulse-ring {
  animation: pulse-ring 2s infinite;
}
