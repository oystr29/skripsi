<script>
  /** @type {{stateStatus: 'idle' | 'run' | 'correct'| 'wrong' | 'fetching'; value: number; max: number; children?: import('svelte').Snippet}} */
  let { stateStatus, value = 0, max = 100, children } = $props();

  let color = $state('#030712'); // 950
  let trackColor = $state('#111827'); // 900
  let fillColor = $state('#6b7280'); // 500

  $effect(() => {
    if (stateStatus === 'correct') {
      color = '#052e16';
      trackColor = '#14532d';
      fillColor = '#22c55e';
    } else if (stateStatus === 'wrong') {
      color = '#450a0a';
      trackColor = '#7f1d1d';
      fillColor = '#ef4444';
    } else if (stateStatus === 'fetching') {
      color = '#422006';
      trackColor = '#713f12';
      fillColor = '#eab308';
    } else if (stateStatus === 'run') {
      color = '#082f49'; // 950
      trackColor = '#0c4a6e'; // 900
      fillColor = '#0ea5e9'; // 500
    } else if (stateStatus === 'idle') {
      color = '#030712'; // 950
      trackColor = '#111827'; // 900
      fillColor = '#6b7280'; // 500
    }
  });

  const progressPath = $derived(() => {
    if (value <= 0) {
      return '';
    } else if (value >= max) {
      return 'M50,5A45 45 0 1 1 49.9999 5';
    } else {
      const angle = Math.PI * 2 * (value / max);
      const x = 50 + Math.cos(angle - Math.PI / 2) * 45;
      const y = 50 + Math.sin(angle - Math.PI / 2) * 45;

      let path = 'M50,5';

      if (angle > Math.PI) {
        path += 'A45 45 0 0 1 50 95';
      }

      path += `A45 45 0 0 1 ${x ?? 0} ${y ?? 0}`;

      return path;
    }
  });
</script>

<div class="sample-3b">
  <svg viewBox="0 0 100 100" fill={fillColor}>
    <path stroke={trackColor} d="M50,5A45 45 0 1 1 49.9999 5" />
    <path stroke={color} d={progressPath()} />
  </svg>
  <div class="text-white text-xl">
    {@render children?.()}
    <span class="span">
      {#if stateStatus === 'run'}
        {Math.floor(value)}
      {:else if stateStatus === 'idle'}
        👍
      {:else if stateStatus === 'correct'}
        ✅
      {:else if stateStatus === 'fetching'}
        <span class="animate-spin">⌛</span>
      {:else if stateStatus === 'wrong'}
        ❌
      {/if}
    </span>
  </div>
</div>

<style>
  svg {
    height: 100%;
    position: absolute;
    stroke-linecap: var(--progress-linecap, round);
    width: 100%;
  }
  path:first-child {
    /* stroke: var(--progress-trackcolor, grey); */
    stroke-width: var(--progress-trackwidth, 9px);
  }
  path:last-child {
    /* stroke: var(--progress-color, lightgreen); */
    stroke-width: var(--progress-width, 10px);
  }
  div {
    height: 100%;
    position: relative;
    width: 100%;
  }
  span.span {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
