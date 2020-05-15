# `@mini-case/immer-redux`

> TODO: description

## Usage

```javascript
const { createStore,useDispatch,useImmutable,Provider } = require('@mini-case/immer-redux');

// redux
const store = createStore({})
//<Provider store={store}>
//</Provider>
const App = () => {
  const dispatch = useDispatch()
  dispatch({ 
    type: 'a.b', 
    payload: { c: 'c' }
  })
  // { a: { b : { c: 'c' } } }
  dispatch({ 
    type: 'a.b', 
    payload: (draft)=> {
      console.log(draft.c); // c
      draft.c = 'd' 
    }
  })
  // { a: { b : { c: 'd' } } }
}

const Component = ()=> {
  // hooks
  const [state,setState] = useImmutable({})
  setState({ 'a.b.c': 'c' })
  console.log(state) 
  // 1. {}   2. { a: { b: { c: 'c ' } } }
}






// TODO: DEMONSTRATE API
```
