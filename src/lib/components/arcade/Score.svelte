<script>
  let score = $state(0);

  export function reset () {
    score = 0;
  }

  export function add () {
    score++;
  }
</script>

<div class="wrapper">
  <span class="score">{ score }</span>
  <span>SOLVED</span>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
  }

  span {
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--theme-color);
    line-height: 100%;
  }
  
  .score {
    font-size: 2rem;
    font-variant-numeric: tabular-nums;
  }
</style>
