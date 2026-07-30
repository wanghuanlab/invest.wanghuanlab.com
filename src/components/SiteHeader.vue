<template>
  <header class="border-b border-ink/15 bg-paper/90">
    <div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
      <RouterLink
        to="/"
        class="font-display text-xl font-semibold tracking-tight text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        Invest Lab
      </RouterLink>
      <RouterLink
        to="/about"
        class="font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        About
      </RouterLink>
    </div>
  </header>
</template>
