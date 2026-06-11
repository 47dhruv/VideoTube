// 1. What is prop drilling and what problem does it solve?
 




// 2. Write a custom hook called useLocalStorage
//    that saves and retrieves a value from localStorage

  function useLocalStorage(key,intialValue) {
    const [value, setValue] = useState(localStorage.getItem(key)||intialValue)
    useEffect(() => {
    localStorage.setItem(key,value)

        
      
    
      
    }, [value])
    return [value,setValue]
}
export default useLocalStorage


// 3. What is the difference between:
useEffect(() => {}, [])
useEffect(() => {})
useEffect(() => {}, [count])

// 4. What is wrong with this code?
const MyComponent = () => {
  const data = fetch('https://api.example.com/data')
  return <div>{data}</div>
}

// 5. When does a React component re-render?
//    Name 3 reasons.