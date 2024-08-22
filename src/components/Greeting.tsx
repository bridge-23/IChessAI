import { userAgent } from "next/server"
import React, { useState } from "react"
import { useQueryCall } from "service/hello"

interface GreetingProps {}

const Greeting: React.FC<GreetingProps> = ({}) => {
  const [name, setName] = useState("")

  const { call, data, error, loading } = useQueryCall({
    refetchOnMount: false,
    functionName: "health",
  })
  

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value
    setName(newName)
  }

  return (
    <div>
      <section>
        <h2>Greeting</h2>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input
          id="name"
          alt="Name"
          type="text"
          value={name}
          onChange={onChangeName}
        />
        <button onClick={call}>Send</button>
      </section>
    </div>
  )
}

export default Greeting
