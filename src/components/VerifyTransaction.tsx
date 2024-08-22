import React, { useEffect } from "react"
import { useQueryCall } from "service/hello"
import { formatEther } from "viem"

interface VerifyTransactionProps {
  item: string;
  hash: string;
}


const VerifyTransaction: React.FC<VerifyTransactionProps> = ({ item, hash }) => {
  const { call, data, error, loading } = useQueryCall({
    refetchOnMount: false,
    functionName: "health"
  })

  useEffect(() => {
    call()
  }, [hash, call])

  if (loading) {
    return <div>Processing…</div>
  } else if (error) {
    return <div>{error.toString()}</div>
  } else if (data) {
    return (
      <div>
        <h3>{item} bought!</h3>
      </div>
    )
  } else {
    return null
  }
}

export default VerifyTransaction;