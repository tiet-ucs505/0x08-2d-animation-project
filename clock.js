// new Clock(this.canvasSel)
// clock.draw(ts)

class Clock {
  dial
  hourHand

  constructor(sel) {
    this.sel = sel
    this.dial = new Dial()
    this.hourHand = new LinePlusCircle(0,55,5,5,0)

  }

  draw(ts) {
    const {canvas, ctx, bb} = getCanvas(this.sel)

    this.dial.draw(ts, ctx)
    this.hourHand.draw(ts, ctx)
    
  }
}

class Drawable {
  getGeometry() {}
  getTransforms() {
    return new DOMMatrix()
  }
  getStyles() {}
  draw(ts, ctx) {
    ctx.save()
    
    ctx.stroke(this.getGeometry())
    ctx.restore()
    
  }
}

class Dial extends Drawable {
  getGeometry() {
    const path = new Path2D()
    path.arc(0,0,100,0,Math.PI*2)

    return path
  }
  getTransforms() {
    return new DOMMatrix()
  }
  getStyles() {}
}

class LinePlusCircle extends Drawable {
  constructor(s,e,w,r,theta) {
    super()
    this.s = s
    this.e = e
    this.w = w
    this.r = r
    this.theta = theta
  }
  getGeometry() {
    const path = new Path2D()
    path.moveTo(this.s,0)
    path.lineTo(this.e,0)

    path.arc(0,0,this.r,0,2*Math.PI)

    return path
  }
  getStyles() {
    return {
      lineWidth: this.w
    }
  }
  getTransforms() {
    return new DOMMatrix()
  }
}
