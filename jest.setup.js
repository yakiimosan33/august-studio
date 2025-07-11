import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock Web APIs
Object.assign(global, {
  TextEncoder,
  TextDecoder,
  Request: class MockRequest {
    constructor(url, options = {}) {
      this.url = url
      this.method = options.method || 'GET'
      this.headers = new Map(Object.entries(options.headers || {}))
      this.body = options.body
    }
    
    get(key) {
      return this.headers.get(key)
    }
    
    json() {
      return Promise.resolve(JSON.parse(this.body || '{}'))
    }
  },
  Response: class MockResponse {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.ok = this.status >= 200 && this.status < 300
    }
    
    json() {
      return Promise.resolve(JSON.parse(this.body))
    }
  }
})