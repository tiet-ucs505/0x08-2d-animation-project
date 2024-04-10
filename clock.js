class Clock {
  sel
  domel
  ctx
  ts = null

  constructor(sel) {
    this.sel = sel
    this.domel = document.querySelector(this.sel)
    this.ctx = this.domel.getContext('2d')
  }

  draw(ts) {
    const ctx = this.ctx
    if (this.ts == null)
      this.ts = ts

    ts -= this.ts

    // Reset the context
    ctx.reset()

    // Transform
    ctx.transform(1,0,0,1,150,150)

    this.drawDial(ts)
    this.drawSecondsHand(ts)
  }

  drawDial(ts) {
    const ctx = this.ctx
    ctx.save()
    
    // Dial (Circle)
    ctx.beginPath()
    ctx.arc(0,0,100,0,2*Math.PI)
    ctx.stroke()

    ctx.restore()
  }


  drawSecondsHand(ts) {
    let angle,ct,st
    const ctx = this.ctx
    ctx.save()

    // Define inital phase of rotation
    angle = -Math.PI*0.5
    ct = Math.cos(angle)
    st = Math.sin(angle)
    ctx.transform(ct,st,-st,ct,0,0)

    // Rotate again based on ts
    angle = (ts/1000)*(2*Math.PI/60)
    ct = Math.cos(angle)
    st = Math.sin(angle)
    ctx.transform(ct,st,-st,ct,0,0)

    // Seconds Hand (line)
    const secondsHandSemiWidth = 5
    const secondsHandLength = 75

    ctx.lineWidth = 2*secondsHandSemiWidth
    ctx.beginPath()
    ctx.moveTo(0,0)
    ctx.lineTo(secondsHandLength,0)
    ctx.stroke()

    // Pivot (Circle)
    ctx.beginPath()
    ctx.arc(
      0,0,
      secondsHandSemiWidth,
      0,2*Math.PI
    )
    ctx.fill()

    ctx.restore()
  }
}
