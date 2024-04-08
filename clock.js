// new Clock(this.canvasSel)
// clock.draw(ts)

class Clock {
  ts0
  dial
  hourHand

  constructor(sel) {
    this.sel = sel
    this.dial = new Dial()
    this.hourHand = new HourHand(0,55,5,5,0)

  }

  draw(ts) {
    
    if (this.ts0 === undefined) {
      this.ts0 = ts
    }

    ts -= this.ts0

    const {canvas, ctx, bb} = getCanvas(this.sel)

    ctx.reset()
    ctx.transform(1.0,0.,0.,1.,150,150)
    this.dial.draw(ts, ctx)
    this.hourHand.draw(ts, ctx)
    
    // console.log({ts})

  }
}

class Drawable {
  getGeometry(ts) {}
  getTransforms(ts) {
    return new DOMMatrix()
  }
  getStyles(ts) {}
  draw(ts, ctx) {
    ctx.save()
    
    ctx.stroke(this.getGeometry(ts))
    ctx.restore()
    
  }
}

class Dial extends Drawable {
  getGeometry(ts) {
    const path = new Path2D()
    path.arc(0,0,100,0,Math.PI*2)

    const wrapper = new Path2D()
    wrapper.addPath(path, this.getTransforms(ts))

    return wrapper
  }
  getTransforms(ts) {
    return new DOMMatrix()
  }
  getStyles(ts) {}
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
  getGeometry(ts) {
    const path = new Path2D()
    path.moveTo(this.s,0)
    path.lineTo(this.e,0)

    path.arc(0,0,this.r,0,2*Math.PI)

    const wrapper = new Path2D()
    wrapper.addPath(path, this.getTransforms(ts))

    return wrapper

    return path
  }
  getStyles(ts) {
    return {
      lineWidth: this.w
    }
  }
  getTransforms(ts) {
    return new DOMMatrix()
  }
}

class HourHand extends LinePlusCircle {
  getTransforms(ts) {
    let theta = (ts/1000) * (Math.PI*2) / 60
    theta = theta + this.theta

    let ct = Math.cos(theta)
    , st = Math.sin(theta)

    // console.log({theta, ct, st})

    return new DOMMatrix([
      ct,st,-st,ct,0,0
    ])
  }
  
}
