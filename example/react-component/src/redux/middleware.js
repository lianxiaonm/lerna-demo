import { createStore, addMiddleware } from '@mini-case/immer-redux'
import { assignTo, parseCookie } from '@mini-case/utils'


addMiddleware((draft) => assignTo(draft, { cookies: parseCookie() }))

export default createStore(state => state, { })
