<script>
  import { page } from "$app/stores";

  let canvas = $state();
  let color = $state();

  $effect(() => {
    color = getComputedStyle(canvas).getPropertyValue('--theme-color');

    new FontFace('Work Sans', 'url(https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2)').load().then(() => {
      const ctx = canvas.getContext('2d');
      const size = canvas.getBoundingClientRect().width;
      const font = '900 75px "Work Sans"';
      
      {
        ctx.font = font;
        const m = ctx.measureText('OUNTLE');
        const w = 105 + m.actualBoundingBoxRight - m.actualBoundingBoxLeft;
        const r = w / size;
        canvas.width = w * r;
        canvas.height = 100 * r;
        ctx.font = font;
        ctx.scale(r, r);
      }

      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(70, 0);
      ctx.arc(70, 30, 30, -Math.PI / 2, 0);
      ctx.lineTo(100, 70);
      ctx.arc(70, 70, 30, 0, Math.PI / 2);
      ctx.lineTo(30, 100);
      ctx.arc(30, 70, 30, Math.PI / 2, Math.PI);
      ctx.lineTo(0, 30);
      ctx.arc(30, 30, 30, Math.PI, 3 * Math.PI / 2);

      ctx.fillStyle = color;
      ctx.fill();

      const m = ctx.measureText('OUNTLE');
      ctx.fillText('OUNTLE', 105, 50 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);

      const n = ctx.measureText('C');
      ctx.fillStyle = 'white';
      ctx.fillText('C', 50 - (n.actualBoundingBoxRight - n.actualBoundingBoxLeft) / 2, 50 + (n.actualBoundingBoxAscent - n.actualBoundingBoxDescent) / 2);
    });
  });
</script>

{ #key $page }
  <canvas bind:this={ canvas } />
{ /key }

<style>
  canvas {
    width: 100%;
    max-width: 25rem;
    margin-bottom: 0.5rem;
    align-self: center;
  }
</style>
    