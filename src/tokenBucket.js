class TokenBucket {
    constructor(ratePerSecond) {
      this.tokens = 0
      this.ratePerSecond = ratePerSecond
      this.lastRefill = Date.now()
    }
  
    tryConsume() {
      this.refill()
      if (this.tokens >= 1) {
        this.tokens--
        return true
      }
      return false
    }
  
    refill() {
      const now = Date.now()
      const elapsed = (now - this.lastRefill) / 1000
      this.tokens = Math.min(
        this.ratePerSecond,
        this.tokens + elapsed * this.ratePerSecond
      )
      this.lastRefill = now
    }
  }

  module.exports = TokenBucket;