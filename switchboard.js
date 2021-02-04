import Trouter from 'trouter'

class Switchboard extends Trouter {
  constructor(opts={}) {
		super(opts)
  }
  
  async handleRequest(request) {
    const url = new URL(request.url)
    const { handlers, params } = this.find(request.method, url.pathname)
    try {
      for await (const handle of handlers) {
        const res = await handle(request, params)
        if (res && res instanceof Response) {
          return res
        }
      }
      return new Response(JSON.stringify(e, null, ' '), {
        status: 400,
        statusText: 'No response generated',
      })
    } catch (e) {
      return new Response(JSON.stringify(e, null, ' '), {
        status: 500,
        statusText: 'Worker failed',
      })
    }
  }

  sendJsonResponse(json) {
    return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    })
  }
}

export default Switchboard
