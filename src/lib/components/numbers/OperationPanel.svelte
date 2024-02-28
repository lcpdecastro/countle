<script>
  let { size = "3rem", validOps, onSelectOperation } = $props();
</script>

<div class="wrapper">
  { #each "\u002b\u2212\u00d7\u00f7" as o }
    <button style:--size={ size } disabled={ !validOps[o] }
      onclick={ () => onSelectOperation(o) }  
    >
      <div class="square">
        <div class="text">
          { o }
        </div>
      </div>
    </button>
  { /each }
</div>

<style>
  .wrapper {
    width: 100%;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-self: end;
  }

  button {
    padding: 0;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    border-radius: 30%;
    transition-property: filter, opacity;
    transition-duration: 0.15s;
  }

  button:disabled {
    filter: grayscale(1);
    opacity: 0.5;
  }

  .square {
    width: var(--size);
    height: var(--size);
    padding: 0.3rem;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    grid-area: 1 / 1 / 2 / 2;
    background: none;
    border: 0.075rem solid var(--theme-color);
    border-radius: 30%;
    backface-visibility: hidden;
    transition: background 0.15s;
  }

  .square:hover {
    background: var(--theme-color-light);
  }

  .text {
    width: 100%;
    text-align: center;
    font-size: calc(var(--size) * 0.5);
    font-weight: bold;
    color: var(--theme-color);
  }
</style>
