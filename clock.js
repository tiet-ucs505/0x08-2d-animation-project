class Clock {
  canvasSel = '#myCanvas'
  ts0 = null
  domel
  ctx

  constructor(sel) {
    this.canvasSel = sel
    this.domel = document.querySelector(sel)
    this.ctx = this.domel.getContext('2d')
    console.log({ctx: this.ctx})
  }

  draw (ts) {
    let ct, st

    // this.debugTs(ts)
    if (this.ts0 == null)
      this.ts0 = ts
    ts -= this.ts0

    const ctx = this.ctx
    ctx.reset()

    ctx.transform(1,0,0,1,150,150)

    // Dial
    ctx.beginPath()
    ctx.arc(0,0,100,0,2*Math.PI)
    ctx.fill()

    // Initial Phase of the Seconds Hand
    const initTheta = -Math.PI * 0.5
    ct = Math.cos(initTheta)
    st = Math.sin(initTheta)
    ctx.transform(ct,st,-st,ct,0,0)

    // Rotate based on ts
    const radians = (2*Math.PI/60)*(ts*1e-3)
    ct = Math.cos(radians)
    st = Math.sin(radians)
    ctx.transform(ct,st,-st,ct,0,0)


    // Seconds Hand
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3

    // Seconds Hand Pivot
    ctx.beginPath()
    ctx.arc(0,0,10,0,2*Math.PI)
    ctx.fill()

    // Seconds Hand Arm
    ctx.beginPath()
    ctx.moveTo(-15,0)
    ctx.lineTo(85,0)
    ctx.stroke()

  }

  debugTs(ts) {
    console.log({
      ts,
      radians: (2*Math.PI/60)*(ts*1e-3),
      deg: 6*(ts*1e-3)
    })

    
  }
}
